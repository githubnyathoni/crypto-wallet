import { forwardRef, Module } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { UserService } from '../services/user.service';
import { AuthModule } from './auth.module';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.usecase';

@Module({
  imports: [forwardRef(() => AuthModule)],
  providers: [
    PrismaService,
    UserService,
    RegisterUserUseCase,
    {
      provide: 'IUserRepository',
      useClass: UserService,
    },
  ],
  exports: [RegisterUserUseCase],
})
export class UserModule {}
