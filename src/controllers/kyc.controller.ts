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
  async callback(
    @Body() { reference, event, verification_data }: KycCallbackDto
  ) {
    try {
      const user = await this.usersService.getUserByKycId(reference);

      if (user) {
        const isValid = await this.kycService.verifyReference(
          user.id,
          reference
        );

        if (isValid) {
          await this.kycService.saveCallback(user.id, reference, event);

          await this.kycService.verifyCallback(
            user.id,
            reference,
            event,
            verification_data
          );
        }
      }
    } catch {}
  }

  @Get('/status')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: String })
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
      return await this.kycService.getVerificationUrl(user.id, user.email);
    } catch {
      throw new InternalServerErrorException('Failed to get verification url');
    }
  }
}
