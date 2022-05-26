import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';

@Controller('system')
@ApiTags('system')
export class SystemController {
  @Get('/liveness')
  @ApiOkResponse()
  getLiveness() {}

  @Get('/readiness')
  @ApiOkResponse()
  getReadiness() {}
}
