import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class KycCallbackDto {
  @IsNotEmpty()
  @ApiProperty()
  reference: string;

  @IsNotEmpty()
  @ApiProperty()
  event: string;
}
