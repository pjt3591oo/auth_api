import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvKey } from 'src/common/env.validator';
import { CommonException } from 'src/common/filter/common.exception';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @Inject(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async validatePayload(payload): Promise<any> {
    const { userId, exp } = payload;
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (new Date(exp) <= new Date()) {
      throw new CommonException('AUTH', 'EXPIRED_TOKEN');
    }
    return user;
  }

  async oauthGithub(code: string) {
    const body = {
      client_id: this.configService.get(EnvKey.GITHUB_CLIENT_ID),
      client_secret: this.configService.get(EnvKey.GITHUB_SECRETS),
      code,
    };
    const res = await fetch('https://github.com/login/oauth/access_token', {
      method: 'post',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    const data = await res.json();
    console.log(data);

    return code;
  }
}
