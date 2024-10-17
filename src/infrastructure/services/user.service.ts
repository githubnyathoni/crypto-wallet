import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user-repository.interface';
import { PrismaService } from '../database/prisma/prisma.service';
import {
  BalanceResponse,
  UserResponse,
} from '../../domain/entities/user.interface';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { MessageResponse } from '../../domain/entities/web.interface';
import { BalanceHistoryService } from './balance-history.service';

@Injectable()
export class UserService implements IUserRepository {
  constructor(
    private prismaService: PrismaService,
    private authService: AuthService,
    private balanceHistoryService: BalanceHistoryService,
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
      throw new HttpException('User not found', 404);
    }

    return {
      balance: user.balance,
    };
  }

  async topUpBalance(userId: string, amount: number): Promise<MessageResponse> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    await this.prismaService.user.update({
      where: { id: userId },
      data: {
        balance: user.balance + amount,
      },
    });

    await this.balanceHistoryService.create(userId, amount, 'TOPUP');

    return {
      message: 'Topup successful',
    };
  }
}
