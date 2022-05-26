import { ApiProperty } from '@nestjs/swagger';
import { IUserContext } from 'abstractions/interfaces';
import { WalletModel } from 'models/wallet.model';

export class UserContextModel implements IUserContext {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  kycStatus: string;

  @ApiProperty({ isArray: true })
  wallets: WalletModel[];
}
