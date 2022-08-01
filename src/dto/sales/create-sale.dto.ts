import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSaleDto {
  @IsNotEmpty()
  @ApiProperty()
  title: string;
}
