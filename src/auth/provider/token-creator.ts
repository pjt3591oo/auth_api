import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { EnvKey } from 'src/common/env.validator';
import { CommonException } from 'src/common/filter/common.exception';

@Injectable()
export class TokenCreator {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  private createPayload(user: User) {
    const payload = {
      userId: user.id,
      iat: Date.now(),
    };
    return payload;
  }

  private expired(expiredDay) {
    return 60 * 60 * 24 * expiredDay;
  }

  createAccessToken(user: User): string {
    const payload = this.createPayload(user);
    const options: JwtSignOptions = {
      expiresIn: new Date().getTime() + this.expired(30),
      subject: 'AccessToken',
      secret: this.configService.get(EnvKey.JWT_KEY),
    };
    try {
      return this.jwtService.sign(payload, options);
    } catch (error) {
      console.log(error);
      throw new CommonException('AUTH', 'FAIL_ACCESS_TOKEN_CREATE');
    }
  }

  createRefreshToken(user: User): string {
    const payload = this.createPayload(user);
    const options: JwtSignOptions = {
      expiresIn: new Date().getTime() + this.expired(100),
      subject: 'RefreshToken',
      secret: this.configService.get(EnvKey.JWT_KEY),
    };
    try {
      return this.jwtService.sign(payload, options);
    } catch (error) {
      throw new CommonException('AUTH', 'FAIL_REFRESH_TOKEN_CREATE');
    }
  }
}
