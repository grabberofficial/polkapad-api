import { Injectable } from '@nestjs/common';
import { MagicCode, MagicCodeTypes, Prisma } from '@prisma/client';
import dayjs from 'dayjs';
import { genSalt, hash, compare } from 'bcryptjs';

import { PrismaRepository } from 'repositories';

const OTP_DIGITS = '0123456789';

@Injectable()
export class MagicCodesService {
  private readonly magicCodeRepository: Prisma.MagicCodeDelegate<Prisma.RejectOnNotFound>;

  constructor(prismaRepository: PrismaRepository) {
    this.magicCodeRepository = prismaRepository.magicCode;
  }

  private generateCode(magicCodeLength = 6): string {
    let magicCode = '';

    for (let i = 1; i <= magicCodeLength; i++) {
      const index = Math.floor(Math.random() * OTP_DIGITS.length);
      magicCode = magicCode + OTP_DIGITS[index];
    }

    return magicCode;
  }

  private async encryptCode(code: string): Promise<string> {
    const salt = await genSalt(12);

    return hash(code, salt);
  }

  public async createMagicCode(
    info: Pick<Prisma.MagicCodeUncheckedCreateInput, 'userId' | 'type'>
  ): Promise<string> {
    const code = this.generateCode();
    const hashedCode = await this.encryptCode(code);

    const newMagicCode = {
      ...info,
      hashedCode,
      expiresAt: dayjs().add(5, 'minutes').toDate()
    };

    await this.magicCodeRepository.create({ data: newMagicCode });

    return code;
  }

  public getLatestCodeByUserId(
    userId: string,
    type: MagicCodeTypes
  ): Promise<MagicCode> {
    return this.magicCodeRepository.findFirst({
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
    await this.magicCodeRepository.deleteMany({
      where: {
        userId
      }
    });
  }

  public async deleteOutdatedCodes() {
    await this.magicCodeRepository.deleteMany({
      where: {
        expiresAt: {
          lt: dayjs().toDate()
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
    const isNotExpired = dayjs().isBefore(dayjs(expiresAt));

    return isValid && isNotExpired;
  }
}
