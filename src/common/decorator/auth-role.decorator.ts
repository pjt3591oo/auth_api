import { SetMetadata } from '@nestjs/common';

import { Role as UserRole } from 'src/user/entities/user.entity';

const MetadataKey = 'roles';
const AuthRole = (roles?: UserRole[]) => SetMetadata(MetadataKey, roles);

export { UserRole, MetadataKey, AuthRole };
