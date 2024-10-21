import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../../application/dtos/create-user.dto';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.usecase';
import { LoginUserDto } from '../../application/dtos/login-user.dto';
import { LoginUserUseCase } from '../../application/use-cases/login-user.usecase';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private registerUserUseCase: RegisterUserUseCase,
    private loginUserUseCase: LoginUserUseCase,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Username already exists',
  })
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.registerUserUseCase.execute(createUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 201,
    description: 'User login successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'You do not have permission to access this resource.',
  })
  @ApiResponse({
    status: 404,
    description: 'Account not found',
  })
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.loginUserUseCase.execute(loginUserDto);
  }
}
