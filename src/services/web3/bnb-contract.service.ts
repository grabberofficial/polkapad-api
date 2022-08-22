import { ethers } from 'ethers';
import { binanceProvider } from 'config/binance';

export class BnbContractService {
  protected provider: ethers.providers.JsonRpcProvider;

  protected contract: ethers.Contract;

  protected connect(address: string, abi: any) {
    this.provider = new ethers.providers.JsonRpcProvider(binanceProvider);
    this.contract = new ethers.Contract(address, abi, this.provider);
  }
}
