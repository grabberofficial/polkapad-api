import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsDateString
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class RoadmapForSale {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  saleId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  step: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startAt: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  finishAt: Date;
}

class TeamMemberForSale {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  saleId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  role: string;
}

class SaleInfoForSale {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  saleId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tgeType: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  vesting: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  parachain: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  address: string;
}

class TokenInfoForSale {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  saleId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  raise: number;
}

export class CreateOrUpdateSaleDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  roadmap: RoadmapForSale[];

  @ApiPropertyOptional()
  @IsOptional()
  teamMembers: TeamMemberForSale[];

  @ApiPropertyOptional()
  @IsOptional()
  info: SaleInfoForSale;

  @ApiPropertyOptional()
  @IsOptional()
  tokenInfo: TokenInfoForSale;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  overview: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startAt: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  finishAt: Date;
}
