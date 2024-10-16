import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { PrismaService } from './infrastructure/database/prisma/prisma.service';
import { AuthModule } from './infrastructure/modules/auth.module';
import { UserModule } from './infrastructure/modules/user.module';
import { UserController } from './infrastructure/controllers/user.controller';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
  ],
  controllers: [AuthController, UserController],
  providers: [PrismaService],
})
export class AppModule {}
