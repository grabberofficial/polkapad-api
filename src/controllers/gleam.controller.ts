import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { RewardActionTypes, RewardSourceTypes } from '@prisma/client';
import { GleamCallbackDto } from 'dto/gleam/gleam-callback.dto';
import { GleamService, RewardsService, UsersService } from 'services';

@Controller('gleam')
@ApiTags('gleam')
export class GleamController {
  constructor(
    private readonly gleamService: GleamService,
    private readonly rewardsService: RewardsService,
    private readonly usersService: UsersService
  ) {}

  @Post('/callback')
  @ApiOkResponse()
  async callback(
    @Body()
    {
      campaign: gleamCampaign,
      user: gleamUser,
      entry: gleamEntry,
      social_links: gleamSocialLinks
    }: GleamCallbackDto
  ) {
    try {
      const isValid = this.gleamService.verifyCallback(gleamCampaign.key);

      if (isValid) {
        const user = await this.usersService.getUserByEmail(gleamUser.email);
        const [socialLink] = gleamSocialLinks;

        await this.gleamService.saveCallback({
          campaignKey: gleamCampaign.key,
          campaignType: gleamCampaign.type,
          entryMethodId: gleamEntry.entry_method_id,
          entryType: gleamEntry.type,
          userEmail: gleamUser.email,
          userId: user?.id,
          city: gleamUser.city,
          countryCode: gleamUser.country_code,
          socialProvider: socialLink.provider,
          socialReference: socialLink.reference
        });

        if (user) {
          await this.rewardsService.createReward({
            userId: user.id,
            source: RewardSourceTypes.GLEAM,
            action: RewardActionTypes.TWITTER_FOLLOW
          });
        }
      }
    } catch {}
  }
}
