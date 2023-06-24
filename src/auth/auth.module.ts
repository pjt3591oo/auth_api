import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvKey } from 'src/common/env.validator';
import { TokenCreator } from './provider/token-creator';
import { User } from 'src/user/entities/user.entity';
import { DataSource } from 'typeorm';
import { DatabaseModule } from 'src/common/database/database.module';
import { AuthService } from './service/auth.service';
import { JwtStrategy } from './provider/jwt.strategy';
import { Token } from 'src/user/entities/token.entity';
import { TokenBlacklist } from 'src/user/entities/tokenBlacklist.entity';
import { CryptoModule } from 'src/crypto/crypto.module';
import { AuthController } from './controller/auth.controller';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get(EnvKey.JWT_KEY),
      }),
    }),
    CryptoModule,
  ],
  controllers: [AuthController],
  providers: [
    TokenCreator,
    AuthService,
    JwtStrategy,
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
  exports: [TokenCreator],
})
export class AuthModule {}
