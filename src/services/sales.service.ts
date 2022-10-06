import { Injectable } from '@nestjs/common';
import { Prisma, Sale, UsersOnSales, SaleStatusTypes } from '@prisma/client';
import { PrismaRepository } from 'repositories';

export type SaleWithUsers = Sale & { users: UsersOnSales[] };

@Injectable()
export class SalesService {
  private readonly salesRepository: Prisma.SaleDelegate<Prisma.RejectOnNotFound>;

  constructor(private readonly prismaRepository: PrismaRepository) {
    this.salesRepository = prismaRepository.sale;
  }

  public async createSale(
    info: Prisma.SaleUncheckedCreateInput
  ): Promise<Sale> {
    return this.salesRepository.create({
      data: info
    });
  }

  public async updateSaleById(
    id: string,
    info: Prisma.SaleUncheckedCreateInput
  ): Promise<Sale> {
    return this.salesRepository.update({
      where: {
        id
      },
      data: info
    });
  }

  public async getSaleById(saleId: string): Promise<Sale> {
    return this.salesRepository.findUnique({
      where: {
        id: saleId
      }
    });
  }

  public getAllSalesByStatus(status: SaleStatusTypes): Promise<Sale[]> {
    return this.salesRepository.findMany({
      where: {
        status
      }
    });
  }

  public async getSalesList(
    search: string,
    offset = 0,
    count = 20
  ): Promise<[Sale[], number]> {
    const rules = {
      where: {
        title: {
          contains: search
        }
      }
    };

    const total = await this.salesRepository.count(rules);

    const data = await this.salesRepository.findMany({
      skip: offset,
      take: count,
      ...rules
    });

    return [data, total];
  }

  public async registerUserOnSale(
    userId: string,
    saleId: string
  ): Promise<SaleWithUsers> {
    return this.salesRepository.update({
      where: {
        id: saleId
      },
      data: {
        users: {
          create: [
            {
              user: {
                connect: { id: userId }
              }
            }
          ]
        }
      },
      include: {
        users: true
      }
    });
  }
}
