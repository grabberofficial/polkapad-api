import { Sale } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SaleModel implements Sale {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

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
