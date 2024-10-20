import { Injectable } from '@nestjs/common';
import { ITransactionRepository } from '../../domain/repositories/transaction-repository.interface';
import { PrismaService } from '../database/prisma/prisma.service';
import {
  TopTransactions,
  TransactionsResponse,
  TransactionsFilter,
} from '../../domain/entities/transaction.interface';
import { TopUsers } from '../../domain/entities/top-user.interface';

@Injectable()
export class TransactionService implements ITransactionRepository {
  private prismaService: PrismaService;

  constructor() {
    this.prismaService = PrismaService.getInstance();
  }

  async getTopTransactionsByUserId(
    userId: string,
    limit: number,
  ): Promise<TopTransactions[]> {
    const transactions = await this.prismaService.transaction.findMany({
      where: {
        OR: [{ fromUserId: userId }, { toUserId: userId }],
      },
      orderBy: {
        amount: 'desc',
      },
      take: limit,
      include: {
        fromUser: {
          select: {
            username: true,
          },
        },
        toUser: {
          select: {
            username: true,
          },
        },
      },
    });

    const parsedTransactions = transactions.map((transaction) => {
      const isDebit = transaction.fromUserId === userId;

      return {
        username: isDebit
          ? transaction.toUser.username
          : transaction.fromUser.username,
        amount: isDebit ? -transaction.amount : transaction.amount,
      };
    });

    return parsedTransactions;
  }

  async getTopUsers(): Promise<TopUsers[]> {
    const topUsers = await this.prismaService.transaction.groupBy({
      by: ['fromUserId'],
      _sum: {
        amount: true,
      },
      orderBy: {
        _sum: {
          amount: 'desc',
        },
      },
      take: 10,
    });

    const usersWithTransactionValues = await Promise.all(
      topUsers.map(async (transaction) => {
        const user = await this.prismaService.user.findUnique({
          where: {
            id: transaction.fromUserId,
          },
        });

        return {
          username: user.username,
          transacted_value: transaction._sum.amount || 0,
        };
      }),
    );

    return usersWithTransactionValues;
  }

  async getTransactions(
    filters: TransactionsFilter,
  ): Promise<TransactionsResponse> {
    const limit = 10;
    const page = parseInt(filters.page) || 1;
    const offset = (page - 1) * limit;
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const startDate = filters.start_date
      ? new Date(filters.start_date)
      : firstDay;
    const endDate = filters.end_date ? new Date(filters.end_date) : new Date();

    const transactions = await this.prismaService.transaction.findMany({
      where: {
        AND: [
          filters.sender
            ? { fromUser: { username: { contains: filters.sender } } }
            : {},
          filters.receiver
            ? { toUser: { username: { contains: filters.receiver } } }
            : {},
          {
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          },
        ],
      },
      take: limit,
      skip: offset,
      include: {
        fromUser: true,
        toUser: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const totalTransactions = await this.prismaService.transaction.count({
      where: {
        AND: [
          filters.sender
            ? { fromUser: { username: { contains: filters.sender } } }
            : {},
          filters.receiver
            ? { toUser: { username: { contains: filters.receiver } } }
            : {},
          {
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          },
        ],
      },
    });

    const hasMore = totalTransactions > page * limit;
    const dailyTransactionMap = new Map<string, number>();
    const detailTransactions = [];

    while (startDate <= endDate) {
      dailyTransactionMap.set(startDate.toISOString().split('T')[0], 0);
      startDate.setDate(startDate.getDate() + 1);
    }

    transactions.forEach((transaction) => {
      const date = transaction.createdAt.toISOString().split('T')[0];
      const total = dailyTransactionMap.get(date) || 0;
      dailyTransactionMap.set(date, total + transaction.amount);

      detailTransactions.push({
        sender: transaction.fromUser.username,
        receiver: transaction.toUser.username,
        amount: transaction.amount,
        created: transaction.createdAt,
      });
    });

    const dailyTransaction = Array.from(dailyTransactionMap.entries()).map(
      ([date, total_amount]) => ({ date, total_amount }),
    );

    return {
      daily_transaction: dailyTransaction,
      detail_transactions: detailTransactions,
      has_more: hasMore,
    };
  }
}
