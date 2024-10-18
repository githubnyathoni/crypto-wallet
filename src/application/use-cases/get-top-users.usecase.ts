import { Inject, Injectable } from '@nestjs/common';
import { TopUsers } from '../../domain/entities/top-user.interface';
import { ITransactionRepository } from '../../domain/repositories/transaction-repository.interface';

@Injectable()
export class GetTopUsersUseCase {
  constructor(
    @Inject('ITransactionRepository')
    private transactionRepository: ITransactionRepository,
  ) {}

  async execute(): Promise<TopUsers[]> {
    return this.transactionRepository.getTopUsers();
  }
}
