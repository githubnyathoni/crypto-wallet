import { Inject, Injectable } from '@nestjs/common';
import { BalanceResponse } from '../../domain/entities/user.interface';
import { IUserRepository } from '../../domain/repositories/user-repository.interface';

@Injectable()
export class GetBalanceUseCase {
  constructor(
    @Inject('IUserRepository') private userRepository: IUserRepository,
  ) {}

  async execute(userId: string): Promise<BalanceResponse> {
    return this.userRepository.getBalance(userId);
  }
}
