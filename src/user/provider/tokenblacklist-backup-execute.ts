import { Inject, Injectable } from '@nestjs/common';
import { TokenBlacklist } from '../entities/tokenBlacklist.entity';
import { DataSource, LessThan, Repository } from 'typeorm';
import { S3Upload } from 'src/s3/provider/s3-upload';
import { subDays } from 'date-fns';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TokenblacklistBackupExecute {
  constructor(
    private readonly s3Upload: S3Upload,
    @Inject(TokenBlacklist)
    private readonly tokenBlacklistRepository: Repository<TokenBlacklist>,
    @Inject('DATA_SOURCE') private readonly dataSource: DataSource,
  ) {}

  async execute() {
    const tokens = await this.tokenBlacklistRepository.find({
      where: {
        createdAt: LessThan(subDays(new Date(), 1)),
      },
    });
    const ids = tokens.map((token) => token.id);
    const ts = tokens.map((token) => token.token);
    if (ids.length) {
      await this.tokenBlacklistRepository.delete(ids);
      const filepath = path.resolve(
        `${process.cwd()}/tokenblacklist-backup/tokenblacklist-backup-${new Date().getTime()}.txt`,
      );
      fs.writeFileSync(filepath, ts.join('\n'));
      await this.s3Upload.toTokenBlacklistBackupUploadFile(filepath);
    }
    return;
  }
}
