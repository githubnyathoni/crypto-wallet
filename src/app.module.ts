import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { PrismaService } from './infrastructure/database/prisma/prisma.service';
import { AuthModule } from './infrastructure/modules/auth.module';
import { UserModule } from './infrastructure/modules/user.module';
import { WalletModule } from './infrastructure/modules/wallet.module';
import { WalletController } from './infrastructure/controllers/wallet.controller';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    WalletModule,
  ],
  controllers: [AuthController, WalletController],
  providers: [PrismaService],
})
export class AppModule {}
