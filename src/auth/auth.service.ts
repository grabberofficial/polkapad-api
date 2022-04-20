import { Auth } from './entity/auth.entity';
import { PrismaService } from './../prisma/prisma.service';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OtpService } from './otp/otp.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';


@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
    private readonly usersService: UsersService,
  ) { }

  async sendCode(email: string): Promise<string> {
    const user = await this.prisma.user.findUnique({ where: { email: email } });

    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }
    const code = await this.otpService.create(user);

    return code;
  }

  async login(loginObject: LoginDto): Promise<Auth> {
    const { email, password } = loginObject;

    const user = await this.prisma.user.findUnique({ where: { email: email } });

    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    if (!user.password) {
      throw new Error('User has no password');
    }

    const passwordMatch = await this.usersService.comparePassword(password, user.password)

    if (!passwordMatch) {
      throw new Error('Invalid credentials');
    }

    return {
      accessToken: this.jwtService.sign({ userId: user.id }),
    };
  }

  async loginByCode(email: string, code: string): Promise<Auth> {
    const user = await this.prisma.user.findUnique({ where: { email: email } });

    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    const otp = await this.otpService.getLatestCodeForUser(user);
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
      accessToken: this.jwtService.sign({ userId: user.id }),
    };
  }

  async registerByCode(createUserDto: CreateUserDto) {
    const user = await this.prisma.user.create({ data: createUserDto })
    await this.otpService.create(user);

    return user;
  }

  validateUser(userId: string) {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

}
