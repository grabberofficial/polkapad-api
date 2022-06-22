import { KycStatusTypes, Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';

import { genSalt, hash, compare } from 'bcryptjs';

import { KycRepository, PrismaRepository } from 'repositories';
import { secretKey } from 'config/kyc';
import {
  KYC_CALLBACK_ACCEPTED_EVENTS,
  KYC_CALLBACK_DECLINED_EVENTS
} from 'constants/kyc.constants';

@Injectable()
export class KycService {
  private readonly usersRepository: Prisma.UserDelegate<Prisma.RejectOnNotFound>;

  private readonly kycCallbacksRepository: Prisma.KycCallbackDelegate<Prisma.RejectOnNotFound>;

  private readonly kycResultsRepository: Prisma.KycResultDelegate<Prisma.RejectOnNotFound>;

  private readonly kycRepository: KycRepository;

  constructor(
    prismaRepository: PrismaRepository,
    kycRepository: KycRepository
  ) {
    this.usersRepository = prismaRepository.user;
    this.kycCallbacksRepository = prismaRepository.kycCallback;
    this.kycResultsRepository = prismaRepository.kycResult;
    this.kycRepository = kycRepository;
  }

  private async generateKycId(userId: string): Promise<string> {
    const salt = await genSalt(12);

    return hash(`KYC-${userId}-${secretKey}`, salt);
  }

  public async verifyReference(
    userId: string,
    reference?: string
  ): Promise<boolean> {
    if (!reference) return false;

    return compare(`KYC-${userId}-${secretKey}`, reference);
  }

  public async saveCallback(
    userId: string,
    kycId: string,
    event: string
  ): Promise<void> {
    await this.kycCallbacksRepository.create({
      data: {
        userId,
        kycId,
        event
      }
    });
  }

  public async verifyCallback(
    userId: string,
    kycId: string,
    event: string,
    verificationData?: any
  ): Promise<void> {
    let kycStatus: KycStatusTypes = KycStatusTypes.IN_PROGRESS;

    if (KYC_CALLBACK_ACCEPTED_EVENTS.includes(event)) {
      kycStatus = KycStatusTypes.ACCEPTED;

      if (verificationData && verificationData?.document) {
        const verificationDocument = verificationData?.document;

        await this.kycResultsRepository.create({
          data: {
            kycId,
            userId,
            firstName: verificationDocument.name?.first_name,
            middleName: verificationDocument.name?.middle_name,
            lastName: verificationDocument.name?.last_name,
            dateOfBirth: verificationDocument.dob,
            country: verificationDocument.country,
            gender: verificationDocument.gender
          }
        });
      }
    } else if (KYC_CALLBACK_DECLINED_EVENTS.includes(event)) {
      kycStatus = KycStatusTypes.DECLINED;

      const declinedCount = await this.getDeclinedKycCallbacksCount(
        userId,
        kycId
      );

      if (declinedCount > 3) {
        kycStatus = KycStatusTypes.BLOCKED;
      }
    }

    await this.usersRepository.update({
      where: {
        kycId
      },
      data: {
        kycStatus
      }
    });
  }

  public getKycCallbacksCountByEvents(
    userId: string,
    kycId: string,
    events: string[]
  ): Promise<number> {
    return this.kycCallbacksRepository.count({
      where: {
        userId,
        kycId,
        event: {
          in: events
        }
      }
    });
  }

  public getDeclinedKycCallbacksCount(
    userId: string,
    kycId: string
  ): Promise<number> {
    return this.getKycCallbacksCountByEvents(
      userId,
      kycId,
      KYC_CALLBACK_DECLINED_EVENTS
    );
  }

  public async getVerificationUrl(
    userId: string,
    userEmail: string
  ): Promise<string> {
    const kycId = await this.generateKycId(userId);

    const verificationUrl = await this.kycRepository.getVerificationUrl(
      kycId,
      userEmail
    );

    await this.usersRepository.update({
      where: {
        id: userId
      },
      data: {
        kycId,
        kycStatus: KycStatusTypes.IN_PROGRESS
      }
    });

    return verificationUrl;
  }
}
