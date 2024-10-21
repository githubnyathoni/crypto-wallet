import { RegisterUserUseCase } from '../../../application/use-cases/register-user.usecase';
import { AuthController } from '../auth.controller';
import { LoginUserUseCase } from '../../../application/use-cases/login-user.usecase';
import { IUserRepository } from '../../../domain/repositories/user-repository.interface';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from '../../../application/dtos/create-user.dto';
import { LoginUserDto } from 'src/application/dtos/login-user.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let registerUserUseCase: RegisterUserUseCase;
  let loginUserUseCase: LoginUserUseCase;

  const mockUserRepository: IUserRepository = {
    register: jest.fn().mockResolvedValue({
      username: 'john_doe',
      access_token:
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE3Mjk1MjY4NTMsImV4cCI6MTc2MTA2Mjg1MywiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.QDntm2MMWQ89KbyEdg6XTxdleVUZ_y3MkQ5JryuUz-k',
    }),
    login: jest.fn().mockResolvedValue({
      accessToken: 'jwt_token',
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        RegisterUserUseCase,
        LoginUserUseCase,
        {
          provide: 'IUserRepository',
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    registerUserUseCase = module.get<RegisterUserUseCase>(RegisterUserUseCase);
    loginUserUseCase = module.get<LoginUserUseCase>(LoginUserUseCase);
  });

  describe('Register user', () => {
    it('should register a new user successfully', async () => {
      const registerDto: CreateUserDto = {
        username: 'john_doe',
        password: 'johndoe123',
      };

      const result = await authController.register(registerDto);

      expect(result).toEqual({
        username: 'john_doe',
        access_token:
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE3Mjk1MjY4NTMsImV4cCI6MTc2MTA2Mjg1MywiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.QDntm2MMWQ89KbyEdg6XTxdleVUZ_y3MkQ5JryuUz-k',
      });
    });
  });

  describe('Login user', () => {
    it('should login the user and return JWT token', async () => {
      const loginDto: LoginUserDto = {
        username: 'johndoe',
        password: 'johndoe123',
      };

      const result = await authController.login(loginDto);

      expect(result).toEqual({
        accessToken: 'jwt_token',
      });
    });
  });
});
