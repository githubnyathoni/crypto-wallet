import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { GetBalanceUseCase } from '../../application/use-cases/get-balance.usecase';
import { JwtAuthGuard } from '../auth/jwt.guards';
import {
  BalanceResponse,
  UserRequest,
} from '../../domain/entities/user.interface';
import { TopUpBalanceUseCase } from '../../application/use-cases/topup-balance.usecase';
import { MessageResponse } from '../../domain/entities/web.interface';
import { TopUpDto } from '../../application/dtos/topup.dto';

@Controller('users')
export class UserController {
  constructor(
    private getBalanceUseCase: GetBalanceUseCase,
    private topUpBalanceUseCase: TopUpBalanceUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('balance')
  async getBalance(@Req() request: UserRequest): Promise<BalanceResponse> {
    const userId = request.user.userId;
    const { balance } = await this.getBalanceUseCase.execute(userId);

    return {
      balance,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('topup')
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
}
