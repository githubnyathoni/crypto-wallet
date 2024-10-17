import { TopTransactions } from '../entities/transaction.interface';

export interface ITransactionRepository {
  getTopTransactionsByUserId(
    userId: string,
    limit: number,
  ): Promise<TopTransactions[]>;
}
