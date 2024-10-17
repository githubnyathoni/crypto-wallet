import { HttpException, Injectable } from '@nestjs/common';
import { IWalletRepository } from '../../domain/repositories/wallet-repository.interface';
import { PrismaService } from '../database/prisma/prisma.service';
import { BalanceHistoryService } from './balance-history.service';
import { MessageResponse } from '../../domain/entities/web.interface';
import { BalanceResponse } from '../../domain/entities/wallet.interface';

@Injectable()
export class WalletService implements IWalletRepository {
  constructor(
    private prismaService: PrismaService,
    private balanceHistoryService: BalanceHistoryService,
  ) {}

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
