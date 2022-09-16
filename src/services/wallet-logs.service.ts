import { Injectable } from '@nestjs/common';

import { Prisma, WalletLog } from '@prisma/client';

import { PrismaRepository } from 'repositories';

@Injectable()
export class WalletLogsService {
  private readonly walletLogsRepository: Prisma.WalletLogDelegate<Prisma.RejectOnNotFound>;

  constructor(prismaRepository: PrismaRepository) {
    this.walletLogsRepository = prismaRepository.walletLog;
  }

  public createWalletLog(
    info: Prisma.WalletLogUncheckedCreateInput
  ): Promise<WalletLog> {
    return this.walletLogsRepository.create({ data: info });
  }

  public async deleteWalletLogById(id: string): Promise<void> {
    await this.walletLogsRepository.delete({
      where: {
        id
      }
    });
  }

  public getWalletLogById(id: string): Promise<WalletLog | null> {
    return this.walletLogsRepository.findUnique({
      where: {
        id
      }
    });
  }

  public getWalletLogsByUserId(userId: string): Promise<WalletLog[]> {
    return this.walletLogsRepository.findMany({
      where: {
        userId
      }
    });
  }
}
