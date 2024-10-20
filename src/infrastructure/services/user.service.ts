import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user-repository.interface';
import { PrismaService } from '../database/prisma/prisma.service';
import { UserResponse } from '../../domain/entities/user.interface';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';

@Injectable()
export class UserService implements IUserRepository {
  private prismaService: PrismaService;

  constructor(private authService: AuthService) {
    this.prismaService = PrismaService.getInstance();
  }

  async register(username: string, password: string): Promise<UserResponse> {
    const existingUser = await this.prismaService.user.findUnique({
      where: {
        username,
      },
    });

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prismaService.user.create({
      data: {
        username,
        password: hashedPassword,
        balance: 0,
        role: 'user',
      },
    });

    const accessToken = this.authService.generateToken(user);

    return {
      username: user.username,
      access_token: accessToken,
    };
  }

  async login(username: string, password: string): Promise<UserResponse> {
    const user = await this.prismaService.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      throw new HttpException('Account not found', 404);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new HttpException('Password is not valid', 401);
    }

    if (user.role !== 'admin') {
      throw new HttpException(' You don’t have permission to access', 403);
    }

    const accessToken = this.authService.generateToken(user);

    return {
      username: user.username,
      access_token: accessToken,
    };
  }
}
