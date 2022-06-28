import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { CodeTypes } from '@prisma/client';
import { IUserContext } from 'abstractions/interfaces';
import { MagicLinkTypeEnum } from 'abstractions/enums';

import { MailService, OtpService, UsersService } from 'services';
import { UserContext } from 'decorators';
import { AuthGuard } from 'guards';
import { SendMagicLinkDto } from 'dto/magic-links';
import { NotFoundException } from 'exceptions';

@UseGuards(AuthGuard)
@Controller('magic-links')
@ApiTags('magic-links')
export class MagicLinksController {
  constructor(
    private readonly usersService: UsersService,
    private readonly otpService: OtpService,
    private readonly mailService: MailService
  ) {}

  @Post()
  @ApiOkResponse()
  async sendMagicLink(
    @UserContext() userContext: IUserContext,
    @Body() { type }: SendMagicLinkDto
  ) {
    const user = await this.usersService.getUserById(userContext.id);

    if (!user) throw new NotFoundException('UserById', userContext.id);

    const code = await this.otpService.createOtp({
      userId: user.id,
      type: type === MagicLinkTypeEnum.Wallet ? CodeTypes.WALLET : CodeTypes.KYC
    });

    const redirectUrl =
      type === MagicLinkTypeEnum.Wallet
        ? '/profile?wallet=true'
        : '/profile?kyc=true';

    const buttonText =
      type === MagicLinkTypeEnum.Wallet ? 'Verify wallets' : 'KYC verification';

    await this.mailService.sendMagicLinkToUser(user, code, buttonText, {
      url: redirectUrl
    });
  }
}
