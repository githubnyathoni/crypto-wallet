import { forwardRef, Module } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { UserService } from '../services/user.service';
import { AuthModule } from './auth.module';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.usecase';
import { LoginUserUseCase } from '../../application/use-cases/login-user.usecase';

@Module({
  imports: [forwardRef(() => AuthModule)],
  providers: [
    PrismaService,
    UserService,
    RegisterUserUseCase,
    LoginUserUseCase,
    {
      provide: 'IUserRepository',
      useClass: UserService,
    },
  ],
  controllers: [],
  exports: [RegisterUserUseCase, LoginUserUseCase],
})
export class UserModule {}
