import { UserResponse } from '../entities/user.interface';

export interface IUserRepository {
  register(username: string, password: string): Promise<UserResponse>;
  // getBalance(userId: string): Promise<BalanceResponse>;
  // topUpBalance(userId: string, amount: number): Promise<MessageResponse>;
}
