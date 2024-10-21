import { Test, TestingModule } from '@nestjs/testing';
import { GetTopUsersUseCase } from '../../../application/use-cases/get-top-users.usecase';
import { ITransactionRepository } from '../../../domain/repositories/transaction-repository.interface';
import { TransactionController } from '../../../infrastructure/controllers/transaction.controller';
import { GetTopTransactionsUseCase } from '../../../application/use-cases/get-top-transactions.usecase';
import { GetTransactionsUseCase } from '../../../application/use-cases/get-transactions.usecase';
import { JwtAuthGuard } from '../../../infrastructure/auth/jwt.guards';
import { ExecutionContext } from '@nestjs/common';
import { UserRequest } from '../../../domain/entities/user.interface';
import { RolesGuard } from '../../../infrastructure/auth/roles.guards';
import { GetTransactionsDto } from '../../../application/dtos/get-transactions.dto';

describe('TransactionController', () => {
  let transactionController: TransactionController;
  let getTopUsersUseCase: GetTopUsersUseCase;
  let getTopTransactionsUseCase: GetTopTransactionsUseCase;
  let getTransactionsUseCase: GetTransactionsUseCase;

  const mockTransactionRepository: ITransactionRepository = {
    getTopUsers: jest.fn().mockResolvedValue([
      { username: 'john_doe', transacted_value: 5000 },
      { username: 'jane_doe', transacted_value: 4000 },
    ]),
    getTopTransactionsByUserId: jest.fn().mockResolvedValue([
      {
        username: 'hermione',
        amount: -100,
      },
      {
        username: 'hermione20',
        amount: 50,
      },
    ]),
    getTransactions: jest.fn().mockResolvedValue({
      daily_transaction: [
        { date: '2024-10-15', total_amount: 1000 },
        { date: '2024-10-16', total_amount: 0 },
      ],
      detail_transactions: [
        {
          amount: 500,
          sender: 'john_doe',
          receiver: 'jane_doe',
          created: '2024-10-15',
        },
        {
          amount: 500,
          sender: 'john_doe',
          receiver: 'jane_doe',
          created: '2024-10-15',
        },
        {
          amount: 0,
          sender: 'john_doe',
          receiver: 'jane_doe',
          created: '2024-10-16',
        },
      ],
      has_more: false,
    }),
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
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const request = context.switchToHttp().getRequest();
          request.user = {
            userId: '99b5d58c-574a-4ffd-9138-4906f8c64653',
            role: ['admin'],
          };
          return true;
        },
      })
      .overrideGuard(RolesGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => true,
      })
      .compile();

    transactionController = module.get<TransactionController>(
      TransactionController,
    );
    getTopUsersUseCase = module.get<GetTopUsersUseCase>(GetTopUsersUseCase);
    getTopTransactionsUseCase = module.get<GetTopTransactionsUseCase>(
      GetTopTransactionsUseCase,
    );
    getTransactionsUseCase = module.get<GetTransactionsUseCase>(
      GetTopTransactionsUseCase,
    );
  });

  describe('top user', () => {
    it('should return top 10 users by transacted value', async () => {
      const result = await transactionController.getTopUsers();
      expect(result).toEqual([
        { username: 'john_doe', transacted_value: 5000 },
        { username: 'jane_doe', transacted_value: 4000 },
      ]);
    });
  });

  describe('top transactions', () => {
    it('should return top 10 transactions of user', async () => {
      const request = {
        user: {
          userId: '99b5d58c-574a-4ffd-9138-4906f8c64653',
        },
      } as UserRequest;
      const result = await transactionController.getTopTransactions(request);

      expect(result).toEqual([
        {
          username: 'hermione',
          amount: -100,
        },
        {
          username: 'hermione20',
          amount: 50,
        },
      ]);
    });
  });

  describe('list transactions', () => {
    it('should return list transactions', async () => {
      const filters: GetTransactionsDto = {
        sender: 'john_doe',
        receiver: 'jane_doe',
        start_date: '2024-10-10',
        end_date: '2024-10-20',
        page: '1',
      };

      const result = await transactionController.getTransactions(filters);

      expect(result).toEqual({
        daily_transaction: [
          { date: '2024-10-15', total_amount: 1000 },
          { date: '2024-10-16', total_amount: 0 },
        ],
        detail_transactions: [
          {
            amount: 500,
            sender: 'john_doe',
            receiver: 'jane_doe',
            created: '2024-10-15',
          },
          {
            amount: 500,
            sender: 'john_doe',
            receiver: 'jane_doe',
            created: '2024-10-15',
          },
          {
            amount: 0,
            sender: 'john_doe',
            receiver: 'jane_doe',
            created: '2024-10-16',
          },
        ],
        has_more: false,
      });
    });
  });
});
