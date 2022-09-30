import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export class SendCodeDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  isAuthorize?: boolean;
}
