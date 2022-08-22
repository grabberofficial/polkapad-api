import { Injectable, OnModuleInit } from '@nestjs/common';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { formatBalance } from '@polkadot/util';

import { polkadotProvider } from 'config/polkadot';

@Injectable()
export class PolkadotTokenService implements OnModuleInit {
  private provider: WsProvider;

  async onModuleInit() {
    this.provider = new WsProvider(polkadotProvider);

    if (!this.provider.isConnected) {
      await this.provider.disconnect();
    }
  }

  public async balanceOf(address: string): Promise<number> {
    const api = await ApiPromise.create({ provider: this.provider });

    const {
      data: { free: balance }
    } = await api.query.system.account(address);

    const decimals = api.registry.chainDecimals[0];

    return parseFloat(
      formatBalance(balance, { withSiFull: true, withUnit: false, decimals })
    );
  }
}
