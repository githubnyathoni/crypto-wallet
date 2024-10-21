import { Test, TestingModule } from '@nestjs/testing';
import { WalletController } from '../../../infrastructure/controllers/wallet.controller';
import { GetBalanceUseCase } from '../../../application/use-cases/get-balance.usecase';
import { TopUpBalanceUseCase } from '../../../application/use-cases/topup-balance.usecase';
import { TransferBalanceUseCase } from '../../../application/use-cases/transfer-balance.usecase';
import { JwtAuthGuard } from '../../../infrastructure/auth/jwt.guards';
import { ExecutionContext } from '@nestjs/common';
import { TopUpDto } from '../../../application/dtos/topup-balance.dto';
import { TransferBalanceDto } from '../../../application/dtos/transfer-balance.dto';
import { IWalletRepository } from 'src/domain/repositories/wallet-repository.interface';
import { UserRequest } from 'src/domain/entities/user.interface';

describe('WalletController', () => {
  let walletController: WalletController;
  let getBalanceUseCase: GetBalanceUseCase;
  let topUpBalanceUseCase: TopUpBalanceUseCase;
  let transferBalanceUseCase: TransferBalanceUseCase;

  const mockWalletRepository: IWalletRepository = {
    getBalance: jest.fn().mockResolvedValue({ balance: 1000 }),
    topUpBalance: jest.fn().mockResolvedValue(undefined),
    transferBalance: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WalletController],
      providers: [
        GetBalanceUseCase,
        TopUpBalanceUseCase,
        TransferBalanceUseCase,
        {
          provide: 'IWalletRepository',
          useValue: mockWalletRepository,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const request = context.switchToHttp().getRequest();
          request.user = { userId: '99b5d58c-574a-4ffd-9138-4906f8c64653' };
          return true;
        },
      })
      .compile();

    walletController = module.get<WalletController>(WalletController);
    getBalanceUseCase = module.get<GetBalanceUseCase>(GetBalanceUseCase);
    topUpBalanceUseCase = module.get<TopUpBalanceUseCase>(TopUpBalanceUseCase);
    transferBalanceUseCase = module.get<TransferBalanceUseCase>(
      TransferBalanceUseCase,
    );
  });

  describe('getBalance', () => {
    it('should return the balance of the user', async () => {
      const request = {
        user: {
          userId: '99b5d58c-574a-4ffd-9138-4906f8c64653',
        },
      } as UserRequest;

      const result = await walletController.getBalance(request);

      expect(result).toEqual({ balance: 1000 });
    });
  });

  describe('topUpBalance', () => {
    it('should top up the user balance and return a success message', async () => {
      const request = {
        user: {
          userId: '99b5d58c-574a-4ffd-9138-4906f8c64653',
        },
      } as UserRequest;

      const topUpDto: TopUpDto = { amount: 500 };
      const result = await walletController.topUpBalance(request, topUpDto);

      expect(result).toEqual({ message: 'Topup successful' });
    });
  });

  describe('transferBalance', () => {
    it('should transfer balance and return a success message', async () => {
      const request = {
        user: {
          userId: '99b5d58c-574a-4ffd-9138-4906f8c64653',
        },
      } as UserRequest;

      const transferBalanceDto: TransferBalanceDto = {
        to_username: 'john_doe',
        amount: 200,
      };
      const result = await walletController.transferBalance(
        request,
        transferBalanceDto,
      );

      expect(result).toEqual({ message: 'Transfer success' });
    });
  });
});
