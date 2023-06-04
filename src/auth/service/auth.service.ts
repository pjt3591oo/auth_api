import { Inject, Injectable } from '@nestjs/common';
import { CommonException } from 'src/common/filter/common.exception';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @Inject(User)
    private readonly userRepository: Repository<User>,
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
}
