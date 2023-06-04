import { Body, Controller, Post } from '@nestjs/common';
import { CryptoManager } from '../provider/crypto-manager';
import { KmsManager } from '../provider/kms-manager';

@Controller('crypto')
export class CryptoController {
  constructor(
    private readonly kmsManager: KmsManager,
    private readonly cryptoManager: CryptoManager,
  ) {}

  @Post('kms/encrypt')
  kmsEncrypt(@Body() body) {
    return this.kmsManager.encrypt(body.text);
  }

  @Post('kms/decrypt')
  kmsDecrypt(@Body() body) {
    return this.kmsManager.decrypt(body.text);
  }

  @Post('crypto/encrypt')
  cryptoEncrypt(@Body() body) {
    return this.cryptoManager.encrypt(body.text);
  }

  @Post('crypto/decrypt')
  cryptoDecrypt(@Body() body) {
    return this.cryptoManager.decrypt(body.text);
  }
}
