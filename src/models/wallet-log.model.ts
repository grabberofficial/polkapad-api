import { ApiProperty } from '@nestjs/swagger';
import { WalletLog } from '@prisma/client';

export class WalletLogModel implements WalletLog {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  network: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  connectAt: Date;
}
