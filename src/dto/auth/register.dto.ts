import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsOptional()
  promocode: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  code: string;
}
