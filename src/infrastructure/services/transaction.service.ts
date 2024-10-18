import { Injectable } from '@nestjs/common';
import { ITransactionRepository } from '../../domain/repositories/transaction-repository.interface';
import { PrismaService } from '../database/prisma/prisma.service';
import { TopTransactions } from '../../domain/entities/transaction.interface';
import { TopUsers } from '../../domain/entities/top-user.interface';

@Injectable()
export class TransactionService implements ITransactionRepository {
  constructor(private prismaService: PrismaService) {}

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
}
