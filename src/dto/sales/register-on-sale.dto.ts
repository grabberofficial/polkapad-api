import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterOnSaleDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  saleId: string;
}
