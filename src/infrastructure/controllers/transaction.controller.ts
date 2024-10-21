import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { GetTopTransactionsUseCase } from '../../application/use-cases/get-top-transactions.usecase';
import { JwtAuthGuard } from '../auth/jwt.guards';
import { UserRequest } from '../../domain/entities/user.interface';
import {
  TopTransactions,
  TransactionsResponse,
} from '../../domain/entities/transaction.interface';
import { TopUsers } from '../../domain/entities/top-user.interface';
import { GetTopUsersUseCase } from '../../application/use-cases/get-top-users.usecase';
import { GetTransactionsUseCase } from '../../application/use-cases/get-transactions.usecase';
import { GetTransactionsDto } from '../../application/dtos/get-transactions.dto';
import { RolesGuard } from '../auth/roles.guards';
import { Roles } from '../auth/roles.decorators';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Transaction')
@Controller('transaction')
export class TransactionController {
  constructor(
    private getTopTransactionsUseCase: GetTopTransactionsUseCase,
    private getTopUsersUseCase: GetTopUsersUseCase,
    private getTransactionsUseCase: GetTransactionsUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('top_transactions')
  @ApiOperation({ summary: 'Get Top Transactions of the user' })
  @ApiResponse({
    status: 200,
    description: 'Get Top Transactions Data successfully',
  })
  async getTopTransactions(
    @Req() request: UserRequest,
  ): Promise<TopTransactions[]> {
    const userId = request.user.userId;

    return await this.getTopTransactionsUseCase.execute(userId, 10);
  }

  @UseGuards(JwtAuthGuard)
  @Get('top_users')
  @ApiOperation({ summary: 'Get Top Users of the transactions' })
  @ApiResponse({
    status: 200,
    description: 'Get Top Users Transactions Data successfully',
  })
  async getTopUsers(): Promise<TopUsers[]> {
    return await this.getTopUsersUseCase.execute();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('list')
  @ApiOperation({ summary: 'Get Transactions list with filter' })
  @ApiResponse({
    status: 200,
    description: 'Get Transactions Data successfully',
  })
  async getTransactions(
    @Query() filters: GetTransactionsDto,
  ): Promise<TransactionsResponse> {
    return await this.getTransactionsUseCase.execute(filters);
  }
}
