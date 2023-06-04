import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';

export const UserIncludeReq = createParamDecorator(
  (key: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as User;
    return key ? user?.[key] : user;
  },
);
