import { Injectable, NotFoundException } from '@nestjs/common';

import { genSalt, hash, compare } from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  protected async hashPassword(password: string): Promise<string> {
    const salt = await genSalt(12);
    const hashedPassword = await hash(password, salt);

    return hashedPassword;
  }

  async comparePassword(password: string, userPassword: string): Promise<boolean> {
    if (!userPassword) return false
    return await compare(password, userPassword);
  }

  create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({ data: createUserDto });
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email
      }
    })

    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    return user
  }
}
