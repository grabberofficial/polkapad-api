import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags, ApiCreatedResponse } from '@nestjs/swagger';
import { MagicCodeTypes } from '@prisma/client';

import { IUserContext } from 'abstractions/interfaces';
import {
  UsersService,
  MagicCodesService,
  JwtService,
  PostmarkService
} from 'services';
import { MagicCodeModel } from 'models';
import {
  SendCodeDto,
  VerifyCodeDto,
  AuthorizeDto,
  RegisterDto
} from 'dto/auth';
import {
  EmailAlreadyUsedException,
  IncorrectEmailOrCodeException,
  IncorrectEmailOrPasswordException,
  NotFoundException
} from 'exceptions';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly magicCodesService: MagicCodesService,
    private readonly postmarkService: PostmarkService
  ) {}

  @Post('/send-code')
  @ApiOkResponse({ type: MagicCodeModel })
  async sendCode(@Body() { email }: SendCodeDto): Promise<MagicCodeModel> {
    const user = await this.usersService.getUserByEmail(email);

    if (!user) {
      const code = await this.magicCodesService.createMagicCode({
        email,
        type: MagicCodeTypes.SIGN_UP
      });

      await this.postmarkService.sendMagicCode(email, code);

      return {
        email,
        type: MagicCodeTypes.SIGN_UP
      };
    }

    return {
      email,
      type: MagicCodeTypes.SIGN_IN
    };
  }

  @Post('/verify-code')
  @ApiOkResponse({ type: MagicCodeModel })
  async verifyCode(
    @Body() { email, code }: VerifyCodeDto
  ): Promise<MagicCodeModel> {
    const lastMagicCode = await this.magicCodesService.getLastCodeByEmail(
      email
    );

    if (!lastMagicCode)
      throw new NotFoundException(
        'MagicCodeByUserEmail',
        email,
        `No code found for email: ${email}`
      );

    const isValidCode = await this.magicCodesService.compareCode(
      code,
      lastMagicCode.hashedCode,
      lastMagicCode.expiresAt
    );

    if (!isValidCode) throw new IncorrectEmailOrCodeException();

    if (lastMagicCode.type === MagicCodeTypes.SIGN_IN) {
      await this.magicCodesService.deleteCodesByEmail(email);
    }

    return {
      email,
      type: lastMagicCode.type
    };
  }

  @Post('/authorize')
  @ApiOkResponse({ type: String })
  async authorize(@Body() { email, password }: AuthorizeDto): Promise<string> {
    const user = await this.usersService.getUserByEmail(email);

    if (!user) throw new IncorrectEmailOrPasswordException();

    const isValidPassword = await this.usersService.comparePassword(
      password,
      user.password
    );

    if (!isValidPassword) throw new IncorrectEmailOrPasswordException();

    const userContext: IUserContext = {
      id: user.id
    };

    return this.jwtService.signAsync(userContext);
  }

  @Post('/register')
  @ApiCreatedResponse({ type: String })
  async register(
    @Body() { code, password, name, promocode, email }: RegisterDto
  ): Promise<string> {
    const verifyResult = await this.verifyCode({ email, code });

    if (verifyResult.type !== MagicCodeTypes.SIGN_UP)
      throw new IncorrectEmailOrCodeException();

    const existUser = await this.usersService.getUserByEmail(email);

    if (existUser) throw new EmailAlreadyUsedException();

    const user = await this.usersService.createUser({
      email,
      password,
      name,
      promocode
    });

    const userContext: IUserContext = {
      id: user.id
    };

    await this.magicCodesService.deleteCodesByEmail(email);

    return this.jwtService.signAsync(userContext);
  }
}
