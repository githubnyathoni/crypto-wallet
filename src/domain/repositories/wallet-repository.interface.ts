import { TransferBalanceDto } from 'src/application/dtos/transfer-balance.dto';
import { BalanceResponse } from '../entities/wallet.interface';
import { MessageResponse } from '../entities/web.interface';

export interface IWalletRepository {
  getBalance(userId: string): Promise<BalanceResponse>;
  topUpBalance(userId: string, amount: number): Promise<MessageResponse>;
  transferBalance(
    userId: string,
    transferBalanceDto: TransferBalanceDto,
  ): Promise<MessageResponse>;
}
