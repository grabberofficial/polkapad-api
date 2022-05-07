import { Otp, CodeTypes } from '@prisma/client';

export class OtpModel implements Otp {
  id: string;

  hashedCode: string;

  userId: string;

  type: CodeTypes;

  createdAt: Date;

  expiresAt: Date;

  constructor(partial: Partial<OtpModel>) {
    Object.assign(this, partial);
  }
}
