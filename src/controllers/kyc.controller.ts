import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOkResponse } from '@nestjs/swagger';

import { KycService } from 'services';
import { AuthGuard } from 'guards';
import { UserContext } from 'decorators';
import { UserContextModel } from 'models';
import { KycCallbackDto } from 'dto/kyc';

@Controller('kyc')
@ApiTags('kyc')
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Post('/callback')
  @ApiOkResponse()
  callback(@Body() { reference, event }: KycCallbackDto) {
    console.log('KycCallbackDto', { reference, event });

    return this.kycService.verifyCallback(reference, event);
  }

  @Get('/verification-url')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: String })
  getVerificationUrl(@UserContext() userContext: UserContextModel) {
    return this.kycService.getVerificationUrl(userContext.id);
  }
}
