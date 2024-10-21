import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { GetBalanceUseCase } from '../../application/use-cases/get-balance.usecase';
import { TopUpBalanceUseCase } from '../../application/use-cases/topup-balance.usecase';
import { JwtAuthGuard } from '../auth/jwt.guards';
import { UserRequest } from '../../domain/entities/user.interface';
import { BalanceResponse } from '../../domain/entities/wallet.interface';
import { TopUpDto } from '../../application/dtos/topup-balance.dto';
import { MessageResponse } from '../../domain/entities/web.interface';
import { TransferBalanceDto } from '../../application/dtos/transfer-balance.dto';
import { TransferBalanceUseCase } from '../../application/use-cases/transfer-balance.usecase';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Wallet')
@Controller('wallet')
export class WalletController {
  constructor(
    private getBalanceUseCase: GetBalanceUseCase,
    private topUpBalanceUseCase: TopUpBalanceUseCase,
    private transferBalanceUseCase: TransferBalanceUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('balance')
  @ApiOperation({ summary: 'Get balance of the user' })
  @ApiResponse({
    status: 200,
    description: 'User created successfully',
  })
  async getBalance(@Req() request: UserRequest): Promise<BalanceResponse> {
    const userId = request.user.userId;
    const { balance } = await this.getBalanceUseCase.execute(userId);

    return {
      balance,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('topup')
  @ApiOperation({ summary: 'Top up balance user' })
  @ApiResponse({
    status: 201,
    description: 'Topup successful',
  })
  async topUpBalance(
    @Req() request: UserRequest,
    @Body() topUpDto: TopUpDto,
  ): Promise<MessageResponse> {
    const userId = request.user.userId;

    await this.topUpBalanceUseCase.execute(userId, topUpDto);

    return {
      message: 'Topup successful',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('transfer')
  @ApiOperation({ summary: 'Transfer balance for another user' })
  @ApiResponse({
    status: 201,
    description: 'Transfer success',
  })
  @ApiResponse({
    status: 404,
    description: 'Destination user not found',
  })
  async transferBalance(
    @Req() request: UserRequest,
    @Body() transferBalanceDto: TransferBalanceDto,
  ): Promise<MessageResponse> {
    const userId = request.user.userId;

    await this.transferBalanceUseCase.execute(userId, transferBalanceDto);

    return {
      message: 'Transfer success',
    };
  }
}
