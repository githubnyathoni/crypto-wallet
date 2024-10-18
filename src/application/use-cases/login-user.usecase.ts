import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user-repository.interface';
import { LoginUserDto } from '../dtos/login-user.dto';
import { UserResponse } from '../../domain/entities/user.interface';

@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject('IUserRepository') private userRepository: IUserRepository,
  ) {}

  async execute(loginUserDto: LoginUserDto): Promise<UserResponse> {
    const { username, password } = loginUserDto;

    return this.userRepository.login(username, password);
  }
}
