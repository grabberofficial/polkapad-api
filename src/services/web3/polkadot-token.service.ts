import { Injectable } from '@nestjs/common';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { formatBalance } from '@polkadot/util';

import { polkadotProvider } from 'config/system';

@Injectable()
export class PolkadotTokenService {

  private readonly provider: WsProvider;

  constructor() {
    this.provider = new WsProvider(polkadotProvider);
  }

  public async balanceOf(address: string): Promise<number> {
    const api = await ApiPromise.create({ provider: this.provider });

    const { data: { free: balance } } = await api.query.system.account(address);

    const decimals = api.registry.chainDecimals[0];

    return parseFloat(formatBalance(balance, { withSiFull: true, withUnit: false, decimals }));
  }
}
