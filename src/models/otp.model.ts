import { ApiProperty } from '@nestjs/swagger';
import { Otp, CodeTypes } from '@prisma/client';

export class OtpModel implements Otp {
  @ApiProperty()
  id: string;

  @ApiProperty()
  hashedCode: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  type: CodeTypes;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  expiresAt: Date;
}
