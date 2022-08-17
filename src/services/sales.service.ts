import { Injectable } from '@nestjs/common';
import { Prisma, Sale, UsersOnSales } from '@prisma/client';
import { PrismaRepository } from 'repositories';

export type SaleWithUsers = Sale & { users: UsersOnSales[] };

@Injectable()
export class SalesService {
  private readonly salesRepository: Prisma.SaleDelegate<Prisma.RejectOnNotFound>;

  constructor(private readonly prismaRepository: PrismaRepository) {
    this.salesRepository = prismaRepository.sale;
  }

  public async create(info: Prisma.SaleUncheckedCreateInput): Promise<Sale> {
    return this.salesRepository.create({
      data: {
        title: info.title
      }
    });
  }

  public async get(saleId: string): Promise<Sale> {
    return this.salesRepository.findUnique({
      where: {
        id: saleId
      }
    });
  }

  public async registerUserOnSale(
    userId: string,
    saleId: string
  ): Promise<SaleWithUsers> {
    return await this.salesRepository.update({
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
