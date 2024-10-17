import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user-repository.interface';
import { TopUpDto } from '../dtos/topup-balance.dto';
import { MessageResponse } from '../../domain/entities/web.interface';

@Injectable()
export class TopUpBalanceUseCase {
  constructor(
    @Inject('IUserRepository') private userRepository: IUserRepository,
  ) {}

  async execute(userId: string, topUpDto: TopUpDto): Promise<MessageResponse> {
    const { amount } = topUpDto;

    return this.userRepository.topUpBalance(userId, amount);
  }
}
