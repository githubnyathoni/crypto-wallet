import { forwardRef, Module } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { UserService } from '../services/user.service';
import { AuthModule } from './auth.module';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.usecase';
import { GetBalanceUseCase } from 'src/application/use-cases/get-balance.usecase';
import { UserController } from '../controllers/user.controller';

@Module({
  imports: [forwardRef(() => AuthModule)],
  providers: [
    PrismaService,
    UserService,
    RegisterUserUseCase,
    GetBalanceUseCase,
    {
      provide: 'IUserRepository',
      useClass: UserService,
    },
  ],
  controllers: [UserController],
  exports: [RegisterUserUseCase, GetBalanceUseCase],
})
export class UserModule {}
