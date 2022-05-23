import { Injectable } from '@nestjs/common';

import { Prisma, User } from '@prisma/client';

import { genSalt, hash, compare } from 'bcryptjs';

import { PrismaRepository } from 'repositories';

@Injectable()
export class UsersService {
  private readonly usersRepository: Prisma.UserDelegate<Prisma.RejectOnNotFound>;

  constructor(prismaRepository: PrismaRepository) {
    this.usersRepository = prismaRepository.user;
  }

  private async encryptPassword(password: string): Promise<string> {
    const salt = await genSalt(12);

    return hash(password, salt);
  }

  public async comparePassword(
    password: string,
    hashedPassword?: string
  ): Promise<boolean> {
    if (!hashedPassword) return false;

    return compare(password, hashedPassword);
  }

  public async createUser(info: Prisma.UserCreateInput): Promise<User> {
    const newUser = { ...info };

    if (info.password) {
      newUser.password = await this.encryptPassword(info.password);
    }

    return this.usersRepository.create({ data: newUser });
  }

  public async updateUserPasswordById(
    userId: string,
    newPassword: string
  ): Promise<User> {
    const hashedPassword = await this.encryptPassword(newPassword);

    return this.usersRepository.update({
      where: {
        id: userId
      },
      data: {
        password: hashedPassword
      }
    });
  }

  public getUserByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findUnique({
      where: {
        email
      }
    });
  }

  public getUserById(userId: string): Promise<User | null> {
    return this.usersRepository.findUnique({
      where: {
        id: userId
      }
    });
  }
}
