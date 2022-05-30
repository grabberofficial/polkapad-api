import { Injectable } from '@nestjs/common';
import { CodeTypes, Otp, Prisma } from '@prisma/client';
import * as moment from 'moment';
import { genSalt, hash, compare } from 'bcryptjs';

import { PrismaRepository } from 'repositories';

const OTP_DIGITS = '0123456789';

@Injectable()
export class OtpService {
  private readonly otpRepository: Prisma.OtpDelegate<Prisma.RejectOnNotFound>;

  constructor(prismaRepository: PrismaRepository) {
    this.otpRepository = prismaRepository.otp;
  }

  private generateCode(otpLength = 6): string {
    let otp = '';

    for (let i = 1; i <= otpLength; i++) {
      const index = Math.floor(Math.random() * OTP_DIGITS.length);
      otp = otp + OTP_DIGITS[index];
    }

    return otp;
  }

  private async encryptCode(code: string): Promise<string> {
    const salt = await genSalt(12);

    return hash(code, salt);
  }

  public async createOtp(
    info: Pick<Prisma.OtpUncheckedCreateInput, 'userId' | 'type'>
  ): Promise<string> {
    const code = this.generateCode();
    const hashedCode = await this.encryptCode(code);

    const newOtp = {
      ...info,
      hashedCode,
      expiresAt: moment().add(5, 'minutes').toDate()
    };

    await this.otpRepository.create({ data: newOtp });

    return code;
  }

  public getLatestCodeByUserId(userId: string, type: CodeTypes): Promise<Otp> {
    return this.otpRepository.findFirst({
      where: {
        userId,
        type
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  public async deleteCodesByUserId(userId: string): Promise<void> {
    await this.otpRepository.deleteMany({
      where: {
        userId
      }
    });
  }

  public async deleteOutdatedCodes() {
    await this.otpRepository.deleteMany({
      where: {
        expiresAt: {
          lt: moment().toDate()
        }
      }
    });
  }

  public async compareCode(
    code: string,
    hashedCode: string,
    expiresAt: Date
  ): Promise<boolean> {
    const isValid = await compare(code, hashedCode);
    const isNotExpired = moment().isBefore(moment(expiresAt).format());

    return isValid && isNotExpired;
  }
}
