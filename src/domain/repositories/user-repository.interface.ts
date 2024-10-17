import { BalanceResponse, UserResponse } from '../entities/user.interface';
import { MessageResponse } from '../entities/web.interface';

export interface IUserRepository {
  register(username: string, password: string): Promise<UserResponse>;
  getBalance(userId: string): Promise<BalanceResponse>;
  topUpBalance(userId: string, amount: number): Promise<MessageResponse>;
}
