import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt.guards';
import { ROLES_KEY } from './roles.decorators';

@Injectable()
export class RolesGuard extends JwtAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean {
    const canActivate = super.canActivate(context);
    if (!canActivate) return false;

    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!requiredRoles.includes(user.role)) {
      throw new HttpException(
        'You do not have permission to access this resource.',
        403,
      );
    }

    return true;
  }
}
