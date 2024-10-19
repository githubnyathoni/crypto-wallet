import { Inject, Injectable } from '@nestjs/common';
import {
  TransactionsResponse,
  TransactionsFilter,
} from '../../domain/entities/transaction.interface';
import { ITransactionRepository } from '../../domain/repositories/transaction-repository.interface';

@Injectable()
export class GetTransactionsUseCase {
  constructor(
    @Inject('ITransactionRepository')
    private transactionRepository: ITransactionRepository,
  ) {}

  async execute(filters: TransactionsFilter): Promise<TransactionsResponse> {
    return this.transactionRepository.getTransactions(filters);
  }
}
