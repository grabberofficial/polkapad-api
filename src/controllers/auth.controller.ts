import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags, ApiCreatedResponse } from '@nestjs/swagger';
import { CodeTypes } from '@prisma/client';

import { IUserContext } from 'abstractions/interfaces';
import { UsersService, OtpService, JwtService, MailService } from 'services';
import { UserModel } from 'models';

import {
  LoginDto,
  LoginCodeDto,
  SendCodeDto,
  RestorePasswordDto
} from 'dto/auth';
import { CreateUserDto, CreateUserOtpDto } from 'dto/users';
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
    private readonly otpService: OtpService,
    private readonly mailService: MailService
  ) {}

  @Post('code/send')
  @ApiOkResponse()
  async sendCode(@Body() { email }: SendCodeDto) {
    const user = await this.usersService.getUserByEmail(email);

    if (!user) throw new NotFoundException('UserByEmail', email);

    const code = await this.otpService.createOtp({
      userId: user.id,
      type: CodeTypes.SIGNIN
    });

    await this.mailService.sendMagicLinkToUser(user, code);
  }

  @Post('code/login')
  @ApiOkResponse({ type: String })
  async loginByCode(@Body() { email, code }: LoginCodeDto) {
    const user = await this.usersService.getUserByEmail(email);

    if (!user) throw new IncorrectEmailOrCodeException();

    const otpCode = await this.otpService.getLatestCodeByUserId(user.id);

    if (!otpCode)
      throw new NotFoundException(
        'OtpCodeByUserEmail',
        email,
        `No code found for email: ${email}`
      );

    const isValidCode = await this.otpService.compareCode(
      code,
      otpCode.hashedCode,
      otpCode.expiresAt
    );

    if (!isValidCode) throw new IncorrectEmailOrCodeException();

    await this.otpService.deleteCodesByUserId(user.id);

    const userContext: IUserContext = {
      id: user.id
    };

    return this.jwtService.signAsync(userContext);
  }

  @Post('code/register')
  @ApiCreatedResponse({ type: UserModel })
  async registerByCode(@Body() { email }: CreateUserOtpDto) {
    const existUser = await this.usersService.getUserByEmail(email);

    if (existUser) throw new EmailAlreadyUsedException();

    const user = await this.usersService.createUser({ email });
    const code = await this.otpService.createOtp({
      userId: user.id,
      type: CodeTypes.SIGNIN
    });

    await this.mailService.sendMagicLinkToUser(user, code);

    return user;
  }

  @Post('password/register')
  @ApiCreatedResponse({ type: UserModel })
  async register(@Body() { password, name, promocode, email }: CreateUserDto) {
    const existUser = await this.usersService.getUserByEmail(email);

    if (existUser) throw new EmailAlreadyUsedException();

    return this.usersService.createUser({
      email,
      password,
      name,
      promocode
    });
  }

  @Post('password/login')
  @ApiOkResponse({ type: String })
  async login(@Body() { email, password }: LoginDto) {
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

  @Post('password/reset')
  @ApiOkResponse()
  async resetPassword(@Body() { email }: SendCodeDto) {
    const user = await this.usersService.getUserByEmail(email);

    if (!user) throw new NotFoundException('UserByEmail', email);

    const code = await this.otpService.createOtp({
      userId: user.id,
      type: CodeTypes.SIGNIN
    });

    await this.mailService.sendResetPasswordToUser(user, code);
  }

  @Post('password/change')
  @ApiOkResponse({ type: String })
  async changePassword(@Body() { email, password, code }: RestorePasswordDto) {
    const user = await this.usersService.getUserByEmail(email);

    if (!user) throw new IncorrectEmailOrCodeException();

    const otpCode = await this.otpService.getLatestCodeByUserId(user.id);

    if (!otpCode)
      throw new NotFoundException(
        'OtpCodeByUserEmail',
        email,
        `No code found for email: ${email}`
      );

    const isValidCode = await this.otpService.compareCode(
      code,
      otpCode.hashedCode,
      otpCode.expiresAt
    );

    if (!isValidCode) throw new IncorrectEmailOrCodeException();

    await this.otpService.deleteCodesByUserId(user.id);

    await this.usersService.updateUserPasswordById(user.id, password);

    const userContext: IUserContext = {
      id: user.id
    };

    return this.jwtService.signAsync(userContext);
  }
}
