import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendCodeDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;
}
