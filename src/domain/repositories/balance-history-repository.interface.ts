import { TransactionType } from '@prisma/client';

export interface IBalanceHistoryRepository {
  create(userId: string, amount: number, type: TransactionType): Promise<void>;
}
