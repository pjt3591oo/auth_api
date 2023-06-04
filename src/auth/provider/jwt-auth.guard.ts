import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { MetadataKey } from 'src/common/decorator/auth-role.decorator';
import { CommonException } from 'src/common/filter/common.exception';
import { Role, User } from 'src/user/entities/user.entity';

@Injectable()
export class JwtAuthGuard extends AuthGuard('JWT-1') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    console.log('JwtAuthGuard canActivate');
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context) {
    if (err || info) {
      throw new CommonException('AUTH', 'JWT AUTH ERROR');
    }
    if (!this.validateUserRole(context, user)) {
      throw new CommonException('AUTH', 'NO_PERMISSION');
    }
    return user;
  }

  validateUserRole(context: ExecutionContext, user: User): boolean {
    if (!context || !user) {
      return false;
    }

    const roles: Role[] = this.reflector.get<Role[]>(
      MetadataKey,
      context.getHandler(),
    );

    if (!Boolean(roles) || roles.length === 0) {
      return true;
    }

    return roles.includes(user.role);
  }
}
