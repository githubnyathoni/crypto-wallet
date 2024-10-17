import { BalanceResponse } from '../entities/wallet.interface';
import { MessageResponse } from '../entities/web.interface';

export interface IWalletRepository {
  getBalance(userId: string): Promise<BalanceResponse>;
  topUpBalance(userId: string, amount: number): Promise<MessageResponse>;
}
