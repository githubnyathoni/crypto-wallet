import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { GetBalanceUseCase } from '../../application/use-cases/get-balance.usecase';
import { JwtAuthGuard } from '../auth/jwt.guards';
import {
  BalanceResponse,
  UserRequest,
} from '../../domain/entities/user.interface';

@Controller('users')
export class UserController {
  constructor(private getBalanceUseCase: GetBalanceUseCase) {}
  @UseGuards(JwtAuthGuard)
  @Get('balance')
  async getBalance(@Req() request: UserRequest): Promise<BalanceResponse> {
    const userId = request.user.userId;
    const { balance } = await this.getBalanceUseCase.execute(userId);
    return {
      balance,
    };
  }
}
