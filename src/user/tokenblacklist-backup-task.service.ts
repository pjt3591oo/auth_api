import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TokenblacklistBackupExecute } from './provider/tokenblacklist-backup-execute';

@Injectable()
export class TokenblacklistBackupTaskService {
  constructor(
    private readonly tokenblacklistBackupExecute: TokenblacklistBackupExecute,
  ) {}

  // 0 0 * * * : 매일 0시
  @Cron('*/1 * * * *')
  async task() {
    await this.tokenblacklistBackupExecute.execute();
  }
}
