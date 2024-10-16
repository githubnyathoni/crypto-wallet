import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../domain/entities/user.interface';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  generateToken(user: User): string {
    const payload = { sub: user.id, username: user.username, role: user.role };

    return this.jwtService.sign(payload);
  }
}
