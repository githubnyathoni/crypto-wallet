import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user-repository.interface';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserResponse } from '../../domain/entities/user.interface';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject('IUserRepository') private userRepository: IUserRepository,
  ) {}

  async execute(createUserDto: CreateUserDto): Promise<UserResponse> {
    const { username, password } = createUserDto;

    return this.userRepository.register(username, password);
  }
}
