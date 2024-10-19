import { Test, TestingModule } from '@nestjs/testing';
import { GetTopUsersUseCase } from '../../../application/use-cases/get-top-users.usecase';
import { ITransactionRepository } from '../../../domain/repositories/transaction-repository.interface';
import { TransactionController } from '../../../infrastructure/controllers/transaction.controller';
import { GetTopTransactionsUseCase } from '../../../application/use-cases/get-top-transactions.usecase';
import { GetTransactionsUseCase } from '../../../application/use-cases/get-transactions.usecase';

describe('TransactionController', () => {
  let transactionController: TransactionController;
  let getTopUsersUseCase: GetTopUsersUseCase;

  const mockTransactionRepository: ITransactionRepository = {
    getTopUsers: jest.fn().mockResolvedValue([
      { username: 'john_doe', transacted_value: 5000 },
      { username: 'jane_doe', transacted_value: 4000 },
    ]),
    getTopTransactionsByUserId: jest.fn(),
    getTransactions: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        GetTopUsersUseCase,
        GetTopTransactionsUseCase,
        GetTransactionsUseCase,
        {
          provide: 'ITransactionRepository',
          useValue: mockTransactionRepository,
        },
      ],
    }).compile();

    transactionController = module.get<TransactionController>(
      TransactionController,
    );
    getTopUsersUseCase = module.get<GetTopUsersUseCase>(GetTopUsersUseCase);
  });

  it('should return top 10 users by transacted value', async () => {
    const result = await transactionController.getTopUsers();
    expect(result).toEqual([
      { username: 'john_doe', transacted_value: 5000 },
      { username: 'jane_doe', transacted_value: 4000 },
    ]);
  });
});
