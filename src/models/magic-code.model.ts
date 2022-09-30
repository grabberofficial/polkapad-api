import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MagicCode, MagicCodeTypes } from '@prisma/client';

export class MagicCodeModel implements Partial<MagicCode> {
  @ApiProperty()
  email: string;

  @ApiProperty({ enum: MagicCodeTypes })
  type: MagicCodeTypes;

  @ApiPropertyOptional()
  token?: string;
}
