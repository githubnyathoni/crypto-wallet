import { TopUsers } from '../entities/top-user.interface';
import {
  TopTransactions,
  TransactionsResponse,
  TransactionsFilter,
} from '../entities/transaction.interface';

export interface ITransactionRepository {
  getTopTransactionsByUserId(
    userId: string,
    limit: number,
  ): Promise<TopTransactions[]>;
  getTopUsers(): Promise<TopUsers[]>;
  getTransactions(filters: TransactionsFilter): Promise<TransactionsResponse>;
}
