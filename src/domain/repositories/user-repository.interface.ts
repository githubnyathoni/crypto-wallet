import { UserResponse } from '../entities/user.interface';

export interface IUserRepository {
  register(username: string, password: string): Promise<UserResponse>;
  login(username: string, password: string): Promise<UserResponse>;
}
