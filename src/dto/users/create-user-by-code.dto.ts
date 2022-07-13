import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserByCodeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Email is invalid' })
  email: string;
}
