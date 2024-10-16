import { ConflictException, Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user-repository.interface';
import { PrismaService } from '../database/prisma/prisma.service';
import {
  BalanceResponse,
  UserResponse,
} from '../../domain/entities/user.interface';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';

@Injectable()
export class UserService implements IUserRepository {
  constructor(
    private prismaService: PrismaService,
    private authService: AuthService,
  ) {}

  async register(username: string, password: string): Promise<UserResponse> {
    const existingUser = await this.prismaService.user.findUnique({
      where: {
        username,
      },
    });

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prismaService.user.create({
      data: {
        username,
        password: hashedPassword,
        balance: 0,
        role: 'user',
      },
    });

    const accessToken = this.authService.generateToken(user);

    return {
      username: user.username,
      access_token: accessToken,
    };
  }

  async getBalance(userId: string): Promise<BalanceResponse> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: { balance: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return {
      balance: user.balance,
    };
  }
}
