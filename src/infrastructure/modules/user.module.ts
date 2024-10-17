import { forwardRef, Module } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { UserService } from '../services/user.service';
import { AuthModule } from './auth.module';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.usecase';
import { GetBalanceUseCase } from '../../application/use-cases/get-balance.usecase';
import { UserController } from '../controllers/user.controller';
import { TopUpBalanceUseCase } from '../../application/use-cases/topup-balance.usecase';
import { BalanceHistoryModule } from './balance-history.module';

@Module({
  imports: [forwardRef(() => AuthModule), BalanceHistoryModule],
  providers: [
    PrismaService,
    UserService,
    RegisterUserUseCase,
    GetBalanceUseCase,
    TopUpBalanceUseCase,
    {
      provide: 'IUserRepository',
      useClass: UserService,
    },
  ],
  controllers: [UserController],
  exports: [RegisterUserUseCase, GetBalanceUseCase, TopUpBalanceUseCase],
})
export class UserModule {}
