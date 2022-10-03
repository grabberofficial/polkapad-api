import { ApiProperty } from '@nestjs/swagger';
import { SaleModel } from 'models/sale.model';

export class SalesListModel {
  @ApiProperty({ type: [SaleModel] })
  data: SaleModel[];

  @ApiProperty()
  total: number;
}
