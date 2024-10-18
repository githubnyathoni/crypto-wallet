import { TopUsers } from '../entities/top-user.interface';
import { TopTransactions } from '../entities/transaction.interface';

export interface ITransactionRepository {
  getTopTransactionsByUserId(
    userId: string,
    limit: number,
  ): Promise<TopTransactions[]>;
  getTopUsers(): Promise<TopUsers[]>;
}
