import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Token } from './entities/token.entity';
import { TokenBlacklist } from './entities/tokenBlacklist.entity';
import { CryptoManager } from 'src/crypto/provider/crypto-manager';
import { CommonException } from 'src/common/filter/common.exception';
import { SigninDto } from './dto/signin-user.dto';
import { TokenCreator } from 'src/auth/provider/token-creator';

@Injectable()
export class UserService {
  constructor(
    @Inject('DATA_SOURCE') private readonly dataSource: DataSource,
    private readonly cryptoManager: CryptoManager,
    private readonly tokenCreator: TokenCreator,
    @Inject(User)
    private readonly userRepository: Repository<User>,
    @Inject(Token)
    private readonly tokenRepository: Repository<Token>,
    @Inject(TokenBlacklist)
    private readonly tokenBlacklistRepository: Repository<TokenBlacklist>,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    const didEncryptEmail = await this.cryptoManager.encrypt(
      createUserDto.email,
    );
    const didEncryptName = await this.cryptoManager.encrypt(createUserDto.name);

    const user = await this.userRepository.findOne({
      where: {
        email: didEncryptEmail,
        name: didEncryptName,
      },
    });

    if (user) {
      throw new CommonException('USER', 'ALREADY_USER', '이미 가입된 유저');
    }

    const didCreateUser = await this.userRepository.save({
      email: didEncryptEmail,
      name: didEncryptName,
    });
    didCreateUser.email = createUserDto.email;
    didCreateUser.name = createUserDto.name;

    return didCreateUser;
  }

  async signin(signinDto: SigninDto) {
    const didEncryptEmail = await this.cryptoManager.encrypt(signinDto.email);
    const didEncryptName = await this.cryptoManager.encrypt(signinDto.name);

    const user = await this.userRepository.findOne({
      where: {
        email: didEncryptEmail,
        name: didEncryptName,
      },
      relations: ['token'],
    });
    if (!user) {
      throw new CommonException(
        'USER',
        'NOT_FOUND_USER',
        '유저를 찾을 수 없습니다.',
      );
    }

    const accessToken = this.tokenCreator.createAccessToken(user);
    const refreshToken = this.tokenCreator.createRefreshToken(user);

    const didEncryptAccessToken = await this.cryptoManager.encrypt(accessToken);
    const didEncryptRefreshToken = await this.cryptoManager.encrypt(
      refreshToken,
    );

    if (user.token) {
      await this.tokenBlacklistRepository.insert({
        token: user.token.accessToken,
      });
      await this.tokenBlacklistRepository.insert({
        token: user.token.refreshToken,
      });

      await this.tokenRepository.delete(user.token.id);
    }

    await this.tokenRepository.save({
      accessToken: didEncryptAccessToken,
      refreshToken: didEncryptRefreshToken,
      user,
    });

    user.email = signinDto.email;
    user.name = signinDto.name;

    return {
      ...user,
      token: {
        accessToken,
        refreshToken,
      },
    };
  }

  getMyInfo(id: number) {
    return `This action returns a #${id} user`;
  }

  async signout(user: User) {
    const temp = await this.userRepository.findOne({
      where: {
        email: user.email,
        name: user.name,
      },
      relations: ['token'],
    });

    if (temp.token) {
      await this.tokenBlacklistRepository.insert({
        token: temp.token.accessToken,
      });
      await this.tokenBlacklistRepository.insert({
        token: temp.token.refreshToken,
      });

      await this.tokenRepository.delete(temp.token.id);
    }
    // return user;
  }

  async withdrawal(user: User) {
    await this.signout(user);
    await this.userRepository.softRemove(user);
  }
}
