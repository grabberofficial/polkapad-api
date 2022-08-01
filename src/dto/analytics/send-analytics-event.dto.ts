import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { AnalyticsEventTypeEnum } from 'abstractions/enums';

export class SendAnalyticsEventDto {
  @IsNotEmpty()
  @IsEnum(AnalyticsEventTypeEnum)
  @ApiProperty({ enum: AnalyticsEventTypeEnum })
  type: AnalyticsEventTypeEnum;
}
