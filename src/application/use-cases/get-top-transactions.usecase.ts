import { Inject, Injectable } from '@nestjs/common';
import { TopTransactions } from '../../domain/entities/transaction.interface';
import { ITransactionRepository } from '../../domain/repositories/transaction-repository.interface';

@Injectable()
export class GetTopTransactionsUseCase {
  constructor(
    @Inject('ITransactionRepository')
    private transactionRepository: ITransactionRepository,
  ) {}

  async execute(userId: string, limit: number): Promise<TopTransactions[]> {
    return this.transactionRepository.getTopTransactionsByUserId(userId, limit);
  }
}
