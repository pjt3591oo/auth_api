import { Module } from '@nestjs/common';
import { CryptoModule } from './crypto.module';
import { CryptoCliCommand } from './provider/crypto-cli-command';

@Module({
  imports: [CryptoModule],
  providers: [CryptoCliCommand],
})
export class CryptoCliModule {}
