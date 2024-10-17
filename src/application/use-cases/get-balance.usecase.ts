import { Inject, Injectable } from '@nestjs/common';
import { IWalletRepository } from '../../domain/repositories/wallet-repository.interface';
import { BalanceResponse } from '../../domain/entities/wallet.interface';

@Injectable()
export class GetBalanceUseCase {
  constructor(
    @Inject('IWalletRepository') private walletRepository: IWalletRepository,
  ) {}

  async execute(userId: string): Promise<BalanceResponse> {
    return this.walletRepository.getBalance(userId);
  }
}
