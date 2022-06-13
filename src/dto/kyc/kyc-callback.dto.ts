import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class KycCallbackDto {
  @IsNotEmpty()
  @ApiProperty()
  reference: string;

  @IsNotEmpty()
  @ApiProperty()
  event: string;

  @IsOptional()
  @ApiProperty()
  verification_data: any;
}
