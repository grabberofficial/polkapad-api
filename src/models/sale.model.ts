import { Sale, SaleStatusTypes } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SaleModel implements Sale {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ enum: SaleStatusTypes })
  status: SaleStatusTypes;

  @ApiPropertyOptional()
  description: string;

  @ApiPropertyOptional()
  overview: string;

  @ApiPropertyOptional()
  startAt: Date;

  @ApiPropertyOptional()
  finishAt: Date;

  @ApiProperty()
  createdAt: Date;
}
