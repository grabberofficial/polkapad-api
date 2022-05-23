import { KycStatusTypes, Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';

import { genSalt, hash } from 'bcryptjs';

import { KycRepository, PrismaRepository } from 'repositories';

@Injectable()
export class KycService {
  private readonly usersRepository: Prisma.UserDelegate<Prisma.RejectOnNotFound>;

  private readonly kycRepository: KycRepository;

  constructor(
    prismaRepository: PrismaRepository,
    kycRepository: KycRepository
  ) {
    this.usersRepository = prismaRepository.user;
    this.kycRepository = kycRepository;
  }

  private async generateKycId(userId: string): Promise<string> {
    const salt = await genSalt(12);

    return hash(`KYC_VERIFICATION_${userId}`, salt);
  }

  public async verifyCallback(kycId: string, event: string): Promise<void> {
    const accepted = ['verification.accepted'];
    const declined = ['verification.declined'];

    let kycStatus: KycStatusTypes = KycStatusTypes.IN_PROGRESS;

    if (accepted.includes(event)) {
      kycStatus = KycStatusTypes.ACCEPTED;
    } else if (declined.includes(event)) {
      kycStatus = KycStatusTypes.DECLINED;
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
