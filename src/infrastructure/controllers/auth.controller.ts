import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../../application/dtos/create-user.dto';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.usecase';

@Controller('auth')
export class AuthController {
  constructor(private registerUserUseCase: RegisterUserUseCase) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.registerUserUseCase.execute(createUserDto);
  }
}
