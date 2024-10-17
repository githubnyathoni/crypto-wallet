import { Module } from '@nestjs/common';
import { BalanceHistoryService } from '../services/balance-history.service';
import { PrismaService } from '../database/prisma/prisma.service';

@Module({
  providers: [BalanceHistoryService, PrismaService],
  exports: [BalanceHistoryService],
})
export class BalanceHistoryModule {}
