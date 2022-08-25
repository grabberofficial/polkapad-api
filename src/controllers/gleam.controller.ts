import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';

@Controller('gleam')
@ApiTags('gleam')
export class GleamController {
  @Post('/callback')
  @ApiOkResponse()
  async callback(@Body() body) {
    console.log('body', body);
  }
}
