import { Injectable } from '@nestjs/common';
import { PrismaService } from '../src/infrastructure/database/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TestService {
  constructor(private prismaService: PrismaService) {}

  async deleteUser(username: string) {
    await this.prismaService.user.deleteMany({
      where: {
        username,
      },
    });
  }

  async createUser(username: string) {
    return await this.prismaService.user.create({
      data: {
        username,
        password: await bcrypt.hash('testing', 10),
        role: 'user',
        balance: 0,
      },
    });
  }

  async findUser(username: string) {
    return await this.prismaService.user.findUnique({
      where: {
        username,
      },
    });
  }

  async topUpBalanceUser() {
    return await this.prismaService.user.update({
      where: {
        username: 'testing',
      },
      data: {
        balance: 10000,
      },
    });
  }

  async createTransaction(
    fromUserId: string,
    toUserId: string,
    amount: number,
  ) {
    return await this.prismaService.transaction.create({
      data: {
        fromUserId,
        toUserId,
        amount,
      },
    });
  }
}
