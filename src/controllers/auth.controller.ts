import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags, ApiCreatedResponse } from '@nestjs/swagger';
import { CodeTypes } from '@prisma/client';

import { AuthService, UsersService, MailService } from 'services';
import { UserModel, AuthModel } from 'models';

import {
  LoginDto,
  LoginCodeDto,
  SendCodeDto,
  RestorePasswordDto
} from 'dto/auth';
import { CreateUserDto, CreateUserOtpDto } from 'dto/users';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
    private readonly usersService: UsersService
  ) {}

  @Post('code/send')
  @ApiOkResponse()
  async sendCode(@Body() { email }: SendCodeDto) {
    const user = await this.usersService.findByEmail(email);
    const code = await this.authService.sendCode(user.email, CodeTypes.SIGNIN);
    // TODO: enable after account change
    // const mail = await this.mailService.sendOTPCodeToUser(user, code)
    // console.log('mail', mail)
    console.log('code', code);
    return { message: 'ok', code };
  }

  @Post('code/login')
  @ApiOkResponse({ type: AuthModel })
  async loginByCode(@Body() { email, code }: LoginCodeDto) {
    // return this.authService.sendCode(email);
    return this.authService.loginByCode(email, code);
  }

  @Post('code/register')
  @ApiCreatedResponse({ type: UserModel })
  async registerByCode(@Body() createUserOtpDto: CreateUserOtpDto) {
    const { user, code } = await this.authService.registerByCode(
      createUserOtpDto
    );
    // TODO: enable after account change
    // const mail = await this.mailService.sendOTPCodeToUser(user, code)
    // console.log('mail', mail)
    console.log('code', code);
    return user;
  }

  @Post('password/register')
  @ApiCreatedResponse({ type: UserModel })
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.register(createUserDto);
    return user;
  }

  @Post('password/login')
  @ApiOkResponse({ type: AuthModel })
  async login(@Body() { email, password }: LoginDto) {
    return this.authService.login({ email, password });
  }

  @Post('password/restore')
  @ApiOkResponse()
  async restorePassword(@Body() { email }: SendCodeDto) {
    const user = await this.usersService.findByEmail(email);
    const code = await this.authService.sendCode(
      user.email,
      CodeTypes.RESTORE_PASSWORD
    );
    // TODO: enable after account change
    // const mail = await this.mailService.sendOTPCodeToUser(user, code)
    // console.log('mail', mail)
    console.log('code', code);
    return { message: 'ok', code };
  }

  @Post('password/change')
  @ApiOkResponse()
  async changePassword(@Body() restorePasswordDto: RestorePasswordDto) {
    await this.authService.restorePassword(restorePasswordDto);

    return { message: 'ok' };
  }
}
