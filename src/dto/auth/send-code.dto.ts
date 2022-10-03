import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsBoolean, IsNotEmpty } from 'class-validator';

export class SendCodeDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional()
  @IsBoolean()
  isAuthorize?: boolean;
}
