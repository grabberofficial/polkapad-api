import { ApiProperty } from '@nestjs/swagger';
import { Sale } from '@prisma/client';

export class SaleModel implements Partial<Sale> {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  createdAt: Date;
}
