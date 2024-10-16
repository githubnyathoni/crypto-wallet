import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { PrismaService } from './infrastructure/database/prisma/prisma.service';
import { AuthModule } from './infrastructure/modules/auth.module';
import { UserModule } from './infrastructure/modules/user.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [PrismaService],
})
export class AppModule {}
