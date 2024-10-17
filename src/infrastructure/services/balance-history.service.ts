import { Injectable } from '@nestjs/common';
import { IBalanceHistoryRepository } from '../../domain/repositories/balance-history-repository.interface';
import { PrismaService } from '../database/prisma/prisma.service';
import { TransactionType } from '@prisma/client';

@Injectable()
export class BalanceHistoryService implements IBalanceHistoryRepository {
  constructor(private prismaService: PrismaService) {}

  async create(
    userId: string,
    amount: number,
    type: TransactionType,
  ): Promise<void> {
    await this.prismaService.balanceHistory.create({
      data: {
        userId,
        amount,
        type,
      },
    });
  }
}
