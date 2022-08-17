import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterOnSaleDto {
  @IsNotEmpty()
  @ApiProperty()
  saleId: string;
}
