import { Injectable, NotFoundException } from '@nestjs/common';

import { genSalt, hash, compare } from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entity/user.entity';

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

  async create(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    let hashedPassword = null;
    if (password) {
      hashedPassword = await this.hashPassword(password);
    }

    const newUser = new UserEntity({
      email: email,
      password: hashedPassword
    });

    return this.prisma.user.create({ data: newUser });
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
