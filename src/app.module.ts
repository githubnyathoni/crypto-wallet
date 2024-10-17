import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { PrismaService } from './infrastructure/database/prisma/prisma.service';
import { AuthModule } from './infrastructure/modules/auth.module';
import { UserModule } from './infrastructure/modules/user.module';
import { WalletModule } from './infrastructure/modules/wallet.module';
import { WalletController } from './infrastructure/controllers/wallet.controller';
import { TransactionModule } from './infrastructure/modules/transaction.module';
import { TransactionController } from './infrastructure/controllers/transaction.controller';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    WalletModule,
    TransactionModule,
  ],
  controllers: [AuthController, WalletController, TransactionController],
  providers: [PrismaService],
})
export class AppModule {}
