import { CodeTypes } from '@prisma/client';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { compare } from 'bcryptjs';
import { UsersService } from 'services/users.service';
import { OtpService } from 'services/otp.service';
import { PrismaService } from 'services/prisma.service';
import { JwtService } from 'services/external';

import { AuthModel } from 'models';

import { RestorePasswordDto, LoginDto } from 'dto/auth';
import { CreateUserDto, CreateUserOtpDto } from 'dto/users';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
    private readonly usersService: UsersService
  ) {}

  async sendCode(email: string, type: CodeTypes): Promise<string> {
    const user = await this.prisma.user.findUnique({ where: { email: email } });

    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }
    const code = await this.otpService.create(user, type);

    return code;
  }

  async login(loginObject: LoginDto): Promise<AuthModel> {
    const { email, password } = loginObject;

    const user = await this.prisma.user.findUnique({ where: { email: email } });

    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    if (!user.password) {
      throw new Error('User has no password');
    }

    const passwordMatch = await this.comparePassword(password, user.password);

    if (!passwordMatch) {
      throw new Error('Invalid credentials');
    }

    return {
      accessToken: this.jwtService.sign({ userId: user.id })
    };
  }

  async loginByCode(email: string, code: string): Promise<AuthModel> {
    const user = await this.prisma.user.findUnique({ where: { email: email } });

    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    const otp = await this.otpService.getLatestCodeForUser(
      user,
      CodeTypes.SIGNIN
    );
    if (!otp) {
      throw new NotFoundException(`No code found for the user: ${email}`);
    }

    const codeValid = await this.otpService.validateCode(otp, code);

    if (!codeValid) {
      throw new UnauthorizedException('Invalid code');
    }

    // purge codes after user login
    this.otpService.deleteCodesForUser(user);

    return {
      accessToken: this.jwtService.sign({ userId: user.id })
    };
  }

  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return user;
  }

  async registerByCode(createUserOtpDto: CreateUserOtpDto) {
    const user = await this.usersService.createByCode(createUserOtpDto);
    const code = await this.otpService.create(user, CodeTypes.SIGNIN);

    return { user, code };
  }

  validateUser(userId: string) {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  async comparePassword(
    password: string,
    userPassword: string
  ): Promise<boolean> {
    if (!userPassword) return false;

    return compare(password, userPassword);
  }

  async restorePassword({
    email,
    password,
    code
  }: RestorePasswordDto): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { email: email } });

    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    const otp = await this.otpService.getLatestCodeForUser(
      user,
      CodeTypes.RESTORE_PASSWORD
    );
    if (!otp) {
      throw new NotFoundException(`No code found for the user: ${email}`);
    }

    const codeValid = await this.otpService.validateCode(otp, code);

    if (!codeValid) {
      throw new UnauthorizedException('Invalid code');
    }

    await this.usersService.changePassword(user, password);

    // purge codes after user login
    await this.otpService.deleteCodesForUser(user);

    return true;
  }
}
