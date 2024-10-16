import { Inject, Injectable } from '@nestjs/common';
import { BalanceResponse } from 'src/domain/entities/user.interface';
import { IUserRepository } from 'src/domain/repositories/user-repository.interface';

@Injectable()
export class GetBalanceUseCase {
  constructor(
    @Inject('IUserRepository') private userRepository: IUserRepository,
  ) {}

  async execute(userId: string): Promise<BalanceResponse> {
    return this.userRepository.getBalance(userId);
  }
}
