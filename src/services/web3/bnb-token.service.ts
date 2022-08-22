import { Injectable, OnModuleInit } from '@nestjs/common';

import { formatEther } from 'ethers/lib/utils';
import { polkadotBnbContract } from 'config/polkadot';

import Polkadot from 'config/abi/polkadot.json';
import { BnbContractService } from './bnb-contract.service';

@Injectable()
export class BnbTokenService
  extends BnbContractService
  implements OnModuleInit
{
  async onModuleInit() {
    try {
      await this.connect(polkadotBnbContract, Polkadot.abi);
    } catch {}
  }

  public async balanceOf(address: string): Promise<number> {
    const balance = await this.contract.balanceOf(address);

    return parseFloat(formatEther(balance));
  }
}
