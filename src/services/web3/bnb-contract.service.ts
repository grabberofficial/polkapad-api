import { Injectable } from '@nestjs/common';

import { ethers } from 'ethers';
import { binanceProvider } from 'config/system';


@Injectable()
export class BnbContractService {

  protected readonly provider: ethers.providers.JsonRpcProvider;
  protected readonly contract: ethers.Contract;

  constructor(address: string, abi: any) {
    this.provider = new ethers.providers.JsonRpcProvider(binanceProvider);
    this.contract = new ethers.Contract(address, abi, this.provider);
  }
}
