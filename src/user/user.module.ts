import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from 'src/common/database/database.module';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { Token } from './entities/token.entity';
import { TokenBlacklist } from './entities/tokenBlacklist.entity';
import { CryptoModule } from 'src/crypto/crypto.module';
import { AuthModule } from 'src/auth/auth.module';
import { TokenblacklistBackupExecute } from './provider/tokenblacklist-backup-execute';
import { TokenblacklistBackupTaskService } from './tokenblacklist-backup-task.service';
import { S3Upload } from 'src/s3/provider/s3-upload';

@Module({
  imports: [DatabaseModule, CryptoModule, forwardRef(() => AuthModule)],
  controllers: [UserController],
  providers: [
    UserService,
    TokenblacklistBackupExecute,
    TokenblacklistBackupTaskService,
    S3Upload,
    {
      provide: User,
      useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: Token,
      useFactory: (dataSource: DataSource) => dataSource.getRepository(Token),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: TokenBlacklist,
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(TokenBlacklist),
      inject: ['DATA_SOURCE'],
    },
  ],
})
export class UserModule {}
