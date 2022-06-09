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

  private readonly kycRepository: KycRepository;

  constructor(
    prismaRepository: PrismaRepository,
    kycRepository: KycRepository
  ) {
    this.usersRepository = prismaRepository.user;
    this.kycCallbacksRepository = prismaRepository.kycCallback;
    this.kycRepository = kycRepository;
  }

  private async generateKycId(userId: string): Promise<string> {
    const salt = await genSalt(12);

    return hash(`KYC_VERIFICATION_${userId}`, salt);
  }

  public async saveCallback(kycId: string, event: string): Promise<void> {
    await this.kycCallbacksRepository.create({
      data: {
        kycId,
        event
      }
    });
  }

  public async verifyCallback(kycId: string, event: string): Promise<void> {
    let kycStatus: KycStatusTypes = KycStatusTypes.IN_PROGRESS;

    if (KYC_CALLBACK_ACCEPTED_EVENTS.includes(event)) {
      kycStatus = KycStatusTypes.ACCEPTED;
    } else if (KYC_CALLBACK_DECLINED_EVENTS.includes(event)) {
      kycStatus = KycStatusTypes.DECLINED;

      const declinedCount = await this.getDeclinedKycCallbacksCount(kycId);

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
    kycId: string,
    events: string[]
  ): Promise<number> {
    return this.kycCallbacksRepository.count({
      where: {
        kycId,
        event: {
          in: events
        }
      }
    });
  }

  public getDeclinedKycCallbacksCount(kycId: string): Promise<number> {
    return this.getKycCallbacksCountByEvents(
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
