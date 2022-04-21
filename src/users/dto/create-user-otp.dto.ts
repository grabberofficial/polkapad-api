import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserOtpDto {
  @ApiProperty()
  @IsEmail({}, { message: 'Email is invalid' })
  email: string;
}
