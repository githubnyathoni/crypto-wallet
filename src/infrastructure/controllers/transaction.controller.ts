import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { GetTopTransactionsUseCase } from 'src/application/use-cases/get-top-transactions.usecase';
import { JwtAuthGuard } from '../auth/jwt.guards';
import { UserRequest } from 'src/domain/entities/user.interface';
import { TopTransactions } from 'src/domain/entities/transaction.interface';

@Controller('transaction')
export class TransactionController {
  constructor(private getTopTransactionsUseCase: GetTopTransactionsUseCase) {}

  @UseGuards(JwtAuthGuard)
  @Get('top_transactions')
  async getTopTransactions(
    @Req() request: UserRequest,
  ): Promise<TopTransactions[]> {
    const userId = request.user.userId;

    return await this.getTopTransactionsUseCase.execute(userId, 10);
  }
}
