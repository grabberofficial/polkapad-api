import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum } from 'class-validator';
import { MagicLinkTypeEnum } from 'abstractions/enums';

export class SendMagicLinkDto {
  @IsNotEmpty()
  @IsEnum(MagicLinkTypeEnum)
  @ApiProperty({ enum: MagicLinkTypeEnum })
  type: MagicLinkTypeEnum;
}
