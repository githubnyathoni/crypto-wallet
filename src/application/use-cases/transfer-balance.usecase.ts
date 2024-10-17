import { Inject, Injectable } from '@nestjs/common';
import { IWalletRepository } from '../../domain/repositories/wallet-repository.interface';
import { TransferBalanceDto } from '../dtos/transfer-balance.dto';
import { MessageResponse } from '../../domain/entities/web.interface';

@Injectable()
export class TransferBalanceUseCase {
  constructor(
    @Inject('IWalletRepository') private walletRepository: IWalletRepository,
  ) {}

  async execute(
    userId: string,
    transferBalanceDto: TransferBalanceDto,
  ): Promise<MessageResponse> {
    return this.walletRepository.transferBalance(userId, transferBalanceDto);
  }
}
