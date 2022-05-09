import { User } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UserModel implements User {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  password: string;

  @ApiProperty({ required: true })
  email: string;

  constructor(partial: Partial<UserModel>) {
    Object.assign(this, partial);
  }
}