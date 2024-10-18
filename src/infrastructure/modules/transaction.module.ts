import { Module } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { TransactionService } from '../services/transaction.service';
import { GetTopTransactionsUseCase } from '../../application/use-cases/get-top-transactions.usecase';
import { TransactionController } from '../controllers/transaction.controller';

@Module({
  providers: [
    TransactionService,
    PrismaService,
    GetTopTransactionsUseCase,
    {
      provide: 'ITransactionRepository',
      useClass: TransactionService,
    },
  ],
  controllers: [TransactionController],
  exports: [TransactionService, GetTopTransactionsUseCase],
})
export class TransactionModule {}
