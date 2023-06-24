import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CryptoModule } from './crypto/crypto.module';

import { validate } from './common/env.validator';

import * as path from 'path';
import { DatabaseModule } from './common/database/database.module';
import { CryptoCliModule } from './crypto/crypto-cli.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
      envFilePath: path.resolve(__dirname, '../.env'),
    }),
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, '..', 'client'),
    }),
    UserModule,
    AuthModule,
    CryptoModule,
    CryptoCliModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
