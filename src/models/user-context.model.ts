import { ApiProperty } from '@nestjs/swagger';
import { IUserContext } from 'abstractions/interfaces';

export class UserContextModel implements IUserContext {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}
