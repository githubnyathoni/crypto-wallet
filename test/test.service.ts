import { Injectable } from '@nestjs/common';
import { PrismaService } from '../src/infrastructure/database/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TestService {
  constructor(private prismaService: PrismaService) {}

  async deleteUser() {
    await this.prismaService.user.deleteMany({
      where: {
        username: 'testing',
      },
    });
  }

  async createUser() {
    return await this.prismaService.user.create({
      data: {
        username: 'testing',
        password: await bcrypt.hash('testing', 10),
        role: 'user',
        balance: 0,
      },
    });
  }
}
