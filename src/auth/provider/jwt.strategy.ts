import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { CommonException } from 'src/common/filter/common.exception';
import { TokenBlacklist } from 'src/user/entities/tokenBlacklist.entity';
import { Repository } from 'typeorm';
import { CryptoManager } from 'src/crypto/provider/crypto-manager';
import { ConfigService } from '@nestjs/config';
import { EnvKey } from 'src/common/env.validator';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'JWT-1') {
  constructor(
    private configService: ConfigService,
    private readonly authService: AuthService,
    @Inject(TokenBlacklist)
    private readonly tokenBlacklistRepository: Repository<TokenBlacklist>,
    private readonly cryptomanager: CryptoManager,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // secretOrKey: configService.get<string>(EnvKey.JWT_KEY),
      secretOrKeyProvider: async (
        _request: Request,
        rawJwtToken: any,
        done: (err: any, secretOrKey?: string | Buffer) => void,
      ) => {
        const didEncryptRawJwtToken = await this.cryptomanager.encrypt(
          rawJwtToken,
        );

        const count = await this.tokenBlacklistRepository.findOne({
          where: {
            token: didEncryptRawJwtToken,
          },
        });

        if (!!count) {
          done(
            new CommonException('AUTH', 'ALREADY_REGISTRY_BLACKLIST_TOKEN'),
            '',
          );
        } else {
          done('', this.configService.get<string>(EnvKey.JWT_KEY));
        }
      },
    });
  }

  async validate(payload): Promise<any> {
    const user = await this.authService.validatePayload(payload);

    if (!user) {
      throw new CommonException('AUTH', 'VALID_JWT');
    }
    return user;
  }
}
