import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email is invalid' })
  @ApiProperty()
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @ApiProperty()
  password: string;
}
