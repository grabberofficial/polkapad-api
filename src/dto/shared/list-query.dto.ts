import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class ListQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  search: string;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @Transform((value) => Number(value))
  offset: number;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @Transform((value) => Number(value))
  count: number;
}
