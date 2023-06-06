import { Module } from '@nestjs/common';
import { KmsManager } from './provider/kms-manager';
import { CryptoManager } from './provider/crypto-manager';
import { HttpModule } from '@nestjs/axios';
import { CryptoController } from './controller/crypto.controller';

@Module({
  imports: [HttpModule],
  controllers: [CryptoController],
  providers: [KmsManager, CryptoManager],
  exports: [CryptoManager, KmsManager],
})
export class CryptoModule {}
