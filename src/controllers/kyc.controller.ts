import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOkResponse } from '@nestjs/swagger';

import { KycService } from 'services';
import { AuthGuard } from 'guards';
import { UserContext } from 'decorators';
import { InternalServerErrorException } from 'exceptions';
import { UserContextModel } from 'models';
import { KycCallbackDto } from 'dto/kyc';

@Controller('kyc')
@ApiTags('kyc')
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Post('/callback')
  @ApiOkResponse()
  callback(@Body() { reference, event }: KycCallbackDto) {
    return this.kycService.verifyCallback(reference, event);
  }

  @Get('/verification-url')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: String })
  async getVerificationUrl(@UserContext() userContext: UserContextModel) {
    try {
      return await this.kycService.getVerificationUrl(userContext.id);
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException('Failed to get verification url');
    }
  }
}
