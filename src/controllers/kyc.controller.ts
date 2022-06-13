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
        await this.kycService.saveCallback(user.id, reference, event);

        await this.kycService.verifyCallback(
          user.id,
          reference,
          event,
          verification_data
        );
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
      return await this.kycService.getVerificationUrl(userContext.id);
    } catch {
      throw new InternalServerErrorException('Failed to get verification url');
    }
  }
}

// kyc-verification_data undefined
// kyc-callback-params {
//   verification_url: 'https://app.shuftipro.com/process/kyc/FUWSAhrXx7LAOL2JNRjBggiWFHiBgWTAfUJHIrnPM0rWcAQviEptelonSxjIverL',
//     email: null,
//     country: null
// }
// kyc-verification_data {
//   document: {
//     name: {
//       first_name: 'NIKOLAY',
//         middle_name: null,
//         last_name: 'DENISENKO'
//     },
//     dob: '1989-08-14',
//       expiry_date: '2031-01-21',
//       issue_date: '2021-01-21',
//       document_number: '763812990',
//       gender: 'M',
//       age: 32,
//       country: 'RU',
//       face_match_confidence: 78,
//       selected_type: [ 'passport' ],
//       supported_types: [ 'id_card', 'passport' ]
//   }
// }
// kyc-callback-params {
//   email: null,
//     country: null,
//     verification_result: {
//     face: 1,
//       document: {
//       face_on_document_matched: 1,
//         age: 1,
//         gender: 1,
//         issue_date: 1,
//         expiry_date: 1,
//         document_number: 1,
//         dob: 1,
//         name: 1,
//         document_visibility: 1,
//         document: 1,
//         document_must_not_be_expired: 1,
//         document_country: 1,
//         selected_type: 1,
//         document_proof: null
//     }
//   },
//   info: {
//     agent: {
//       is_desktop: true,
//         is_phone: false,
//         useragent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.61 Safari/537.36',
//         device_name: 'Macintosh',
//         browser_name: '',
//         platform_name: 'Mac OS 10.15.7'
//     },
//     geolocation: {
//       host: '',
//         ip: '202.153.81.254',
//         rdns: '202.153.81.254',
//         asn: '55944',
//         isp: 'Ooredoo Maldives Plc',
//         country_name: 'Maldives',
//         country_code: 'MV',
//         region_name: 'Kaafu Atoll',
//         region_code: '26',
//         city: 'Male',
//         postal_code: '20002',
//         continent_name: 'Asia',
//         continent_code: 'AS',
//         latitude: '4.175300121307373',
//         longitude: '73.50890350341797',
//         metro_code: '',
//         timezone: 'Indian/Maldives',
//         ip_type: 'ipv4',
//         capital: 'Malé',
//         currency: 'MVR'
//     }
//   }
// }
