import '@polkadot/api-augment';

import { Injectable } from '@nestjs/common';
import {
  UsersService,
  UserWithWallets,
  BnbTokenService,
  PolkadotTokenService
} from 'services';
import { WalletName } from 'abstractions/enums';

export type UserWithBalances = UserWithWallets & { ethBalance: number, polkaBalance: number };

@Injectable()
export class BalancesService {

  constructor(
    private readonly bnbTokenService: BnbTokenService,
    private readonly polkadotService: PolkadotTokenService,
    private readonly userService: UsersService
  ) {}

  public async getBy(user: UserWithWallets): Promise<UserWithBalances> {
    const ethWallet = user.wallets.find(wallet => wallet.name === WalletName.ETH);
    const polkaWallet = user.wallets.find(wallet => wallet.name === WalletName.POLKA);

    return {
      ...user,
      ethBalance: await this.bnbTokenService.balanceOf(ethWallet.value),
      polkaBalance: await this.polkadotService.balanceOf(polkaWallet.value)
    };
  }

  public async getRegisteredOnSaleBalances(saleId: string): Promise<UserWithBalances[]> {
    const users = await this.userService.getRegisteredOnSaleUsers(saleId);

    return await Promise.all(users.map(async user => await this.getBy(user)));
  }
}
