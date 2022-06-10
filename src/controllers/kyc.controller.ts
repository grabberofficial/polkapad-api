import { KycStatusTypes } from '@prisma/client';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOkResponse } from '@nestjs/swagger';

import { KycService, UsersService } from 'services';
import { AuthGuard } from 'guards';
import { UserContext } from 'decorators';
import {
  InternalServerErrorException,
  KycAlreadyAcceptedException,
  KycBlockedException
} from 'exceptions';
import { UserContextModel } from 'models';
import { KycCallbackDto } from 'dto/kyc';

@Controller('kyc')
@ApiTags('kyc')
export class KycController {
  constructor(
    private readonly kycService: KycService,
    private readonly usersService: UsersService
  ) {}

  @Post('/callback')
  @ApiOkResponse()
  async callback(@Body() { reference, event }: KycCallbackDto) {
    try {
      await this.kycService.saveCallback(reference, event);

      return await this.kycService.verifyCallback(reference, event);
    } catch {}
  }

  @Post('/status')
  @ApiOkResponse()
  async getStatus(@UserContext() userContext: UserContextModel) {
    const user = await this.usersService.getUserById(userContext.id);

    return user.kycStatus;
  }

  @Get('/verification-url')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: String })
  async getVerificationUrl(@UserContext() userContext: UserContextModel) {
    const user = await this.usersService.getUserById(userContext.id);

    if (user.kycStatus === KycStatusTypes.ACCEPTED)
      throw new KycAlreadyAcceptedException();

    if (user.kycStatus === KycStatusTypes.BLOCKED)
      throw new KycBlockedException();

    try {
      return await this.kycService.getVerificationUrl(userContext.id);
    } catch {
      throw new InternalServerErrorException('Failed to get verification url');
    }
  }
}
