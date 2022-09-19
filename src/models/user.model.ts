import { KycStatusTypes, UserRoleTypes, User } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UserModel implements User {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: UserRoleTypes })
  role: UserRoleTypes;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  password: string;

  @ApiProperty({ required: false })
  promocode: string;

  @ApiProperty({ required: false })
  kycId: string;

  @ApiProperty({ required: false, enum: KycStatusTypes })
  kycStatus: KycStatusTypes;

  @ApiProperty({ required: true })
  email: string;
}
