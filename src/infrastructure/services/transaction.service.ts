import { Injectable } from '@nestjs/common';
import { ITransactionRepository } from 'src/domain/repositories/transaction-repository.interface';
import { PrismaService } from '../database/prisma/prisma.service';
import { TopTransactions } from 'src/domain/entities/transaction.interface';

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
}
