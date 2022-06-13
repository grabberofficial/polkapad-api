import { KycStatusTypes, Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';

import { genSalt, hash } from 'bcryptjs';

import { KycRepository, PrismaRepository } from 'repositories';
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

    return hash(`KYC_VERIFICATION_${userId}`, salt);
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

      if (verificationData) {
        await this.kycResultsRepository.create({
          data: {
            kycId,
            userId,
            firstName: verificationData?.name?.first_name,
            middleName: verificationData?.name?.middle_name,
            lastName: verificationData?.name?.last_name,
            dateOfBirth: verificationData?.dob,
            gender: verificationData?.gender
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

  public async getVerificationUrl(userId: string): Promise<string> {
    const kycId = await this.generateKycId(userId);

    const verificationUrl = await this.kycRepository.getVerificationUrl(kycId);

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
