import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { KMSClient, EncryptCommand, DecryptCommand } from '@aws-sdk/client-kms';

import { EnvKey } from 'src/common/env.validator';
import { CommonException } from 'src/common/filter/common.exception';

interface KMS_RES_ENCRYPT {
  CiphertextBlob: string;
}

interface KMS_RES_DECRYPT {
  Plaintext: string;
}

@Injectable()
export class KmsManager {
  #kms;
  #keyId;

  constructor(private configService: ConfigService) {
    // this.#baseUrl = configService.get(EnvKey.AWS_HOST);
    this.#kms = new KMSClient({
      credentials: {
        accessKeyId: this.configService.get(EnvKey.AWS_ACCESS_KEY_ID),
        secretAccessKey: this.configService.get(EnvKey.AWS_SECRET_ACCESS_KEY),
      },
      region: this.configService.get(EnvKey.AWS_DEFAULT_REGION),
      endpoint: this.configService.get(EnvKey.AWS_HOST),
    });

    this.#keyId = this.configService.get(EnvKey.AWS_KMS_KEY_ID);
  }

  async encrypt(str: string): Promise<string> {
    const encryptCommand = new EncryptCommand({
      KeyId: this.#keyId,
      Plaintext: Buffer.from(str),
    });

    try {
      const response: KMS_RES_ENCRYPT = await this.#kms.send(encryptCommand);
      const encryptedData = Buffer.from(response.CiphertextBlob).toString(
        'base64',
      );
      return encryptedData;
    } catch (error) {
      throw new CommonException('CRYPTO', 'validate', '암호화 중 문제발생');
    }
  }

  async decrypt(cipherText: string) {
    const params = {
      CiphertextBlob: Buffer.from(cipherText, 'base64'),
    };

    try {
      const command = new DecryptCommand(params);
      const response: KMS_RES_DECRYPT = await this.#kms.send(command);
      const decryptedData = Buffer.from(response.Plaintext).toString();
      return decryptedData;
    } catch (error) {
      throw new CommonException('CRYPTO', 'validate', '암호화 중 문제발생');
    }
  }
}
