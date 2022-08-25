import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

class GleamCampaign {
  @ApiProperty()
  name: string;

  @ApiProperty()
  key: string;

  @ApiProperty()
  type: string;
}

class GleamUser {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  country_code: string;
}

class GleamEntry {
  @ApiProperty()
  id: number;

  @ApiProperty()
  entry_method_id: string;

  @ApiProperty()
  type: string;
}

class GleamSocialLink {
  @ApiProperty()
  provider: string;

  @ApiProperty()
  reference: string;
}

export class GleamCallbackDto {
  @IsNotEmpty()
  @ApiProperty()
  campaign: GleamCampaign;

  @IsNotEmpty()
  @ApiProperty()
  user: GleamUser;

  @IsNotEmpty()
  @ApiProperty()
  entry: GleamEntry;

  @IsNotEmpty()
  @ApiProperty()
  social_links: GleamSocialLink[];
}
