import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthRole, UserRole } from './auth-role.decorator';
import { JwtAuthGuard } from 'src/auth/provider/jwt-auth.guard';

export function Auth(roles?: UserRole[]) {
  return applyDecorators(AuthRole(roles), UseGuards(JwtAuthGuard));
}
