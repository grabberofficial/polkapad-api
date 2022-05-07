import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class CreateUserOtpDto {
  @ApiProperty()
  @IsEmail({}, { message: 'Email is invalid' })
  email: string;
}
