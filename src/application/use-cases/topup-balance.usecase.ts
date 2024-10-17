import { Inject, Injectable } from '@nestjs/common';
import { IWalletRepository } from '../../domain/repositories/wallet-repository.interface';
import { TopUpDto } from '../dtos/topup-balance.dto';
import { MessageResponse } from '../../domain/entities/web.interface';

@Injectable()
export class TopUpBalanceUseCase {
  constructor(
    @Inject('IWalletRepository') private walletRepository: IWalletRepository,
  ) {}

  async execute(userId: string, topUpDto: TopUpDto): Promise<MessageResponse> {
    const { amount } = topUpDto;

    return this.walletRepository.topUpBalance(userId, amount);
  }
}
