import { ApiProperty } from '@nestjs/swagger';
import { Wallet } from '@prisma/client';

export class WalletModel implements Wallet {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  name: string;

  @ApiProperty()
  value: string;

  @ApiProperty()
  userId: string;
}
