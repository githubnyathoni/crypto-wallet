import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../../application/dtos/create-user.dto';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.usecase';
import { LoginUserDto } from '../../application/dtos/login-user.dto';
import { LoginUserUseCase } from '../../application/use-cases/login-user.usecase';

@Controller('auth')
export class AuthController {
  constructor(
    private registerUserUseCase: RegisterUserUseCase,
    private loginUserUseCase: LoginUserUseCase,
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.registerUserUseCase.execute(createUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.loginUserUseCase.execute(loginUserDto);
  }
}
