import { Module } from '@nestjs/common';
import { WalletService } from '../services/wallet.service';
import { PrismaService } from '../database/prisma/prisma.service';
import { BalanceHistoryModule } from './balance-history.module';
import { GetBalanceUseCase } from '../../application/use-cases/get-balance.usecase';
import { TopUpBalanceUseCase } from '../../application/use-cases/topup-balance.usecase';
import { WalletController } from '../controllers/wallet.controller';

@Module({
  imports: [BalanceHistoryModule],
  providers: [
    WalletService,
    PrismaService,
    GetBalanceUseCase,
    TopUpBalanceUseCase,
    {
      provide: 'IWalletRepository',
      useClass: WalletService,
    },
  ],
  controllers: [WalletController],
  exports: [WalletService, GetBalanceUseCase, TopUpBalanceUseCase],
})
export class WalletModule {}
