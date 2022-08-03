import { Injectable } from '@nestjs/common';

import { formatEther } from 'ethers/lib/utils';
import { polkadotBnbContract } from 'config/system';

import Polkadot from 'config/abi/Polkadot.json';
import { BnbContractService } from './bnb-contract.service';

@Injectable()
export class BnbTokenService extends BnbContractService {
  constructor() {
    super(polkadotBnbContract, Polkadot.abi);
  }

  public async balanceOf(address: string): Promise<number> {
    const balance = await this.contract.balanceOf(address);
    return parseFloat(formatEther(balance));
  }
}
