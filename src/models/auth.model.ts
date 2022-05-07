import { ApiProperty } from '@nestjs/swagger';

export class AuthModel {
  @ApiProperty()
  accessToken: string;
}
