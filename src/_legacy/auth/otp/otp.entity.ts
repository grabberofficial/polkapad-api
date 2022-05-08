import { Otp, CodeTypes } from '@prisma/client';

export class OtpEntity implements Otp {
  id: string;

  createdAt: Date;

  expiresAt: Date;

  hashedCode: string;

  userId: string;

  type: CodeTypes;

  constructor(partial: Partial<OtpEntity>) {
    Object.assign(this, partial);
  }
}
