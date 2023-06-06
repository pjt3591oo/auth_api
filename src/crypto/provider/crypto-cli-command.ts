import { Command, CommandRunner, Option } from 'nest-commander';
import { CryptoManager } from './crypto-manager';
import { KmsManager } from './kms-manager';

interface CryptoCliCommandOptions {
  userEncrypt?: string;
  userDecrypt?: string;
  dekEncrypt?: string;
  dekDecrypt?: string;
}

@Command({ name: 'crypto', description: 'crypto management' })
export class CryptoCliCommand extends CommandRunner {
  constructor(
    private readonly cryptoManager: CryptoManager,
    private readonly kmsManager: KmsManager,
  ) {
    super();
  }

  async run(
    passedParam: string[],
    options?: CryptoCliCommandOptions,
  ): Promise<void> {
    if (options.userEncrypt) {
      console.log(await options.userEncrypt);
    } else if (options.userDecrypt) {
      console.log(await options.userDecrypt);
    } else if (options.dekEncrypt) {
      console.log(await options.dekEncrypt);
    } else {
      console.log(await options.dekDecrypt);
    }
    process.exit();
  }

  @Option({
    flags: '-ue, --user-encrypt [plaintext]',
    description: 'plaintext for encrypt',
  })
  async userEncrypt(plaintext: string): Promise<string> {
    return await this.cryptoManager.encrypt(plaintext);
  }

  @Option({
    flags: '-ud, --user-decrypt [ciphertext]',
    description: 'ciphertext for decrypt',
  })
  async userDecrypt(ciphertext: string): Promise<string> {
    return await this.cryptoManager.decrypt(ciphertext);
  }

  @Option({
    flags: '-de, --dek-encrypt [plaintext]',
    description: 'plaintext for decrypt with kms',
  })
  async dekEncrypt(plaintext: string): Promise<string> {
    return await this.kmsManager.encrypt(plaintext);
  }

  @Option({
    flags: '-dd, --dek-decrypt [ciphertext]',
    description: 'ciphertext for decrypt with kms',
  })
  async dekDecrypt(ciphertext: string): Promise<string> {
    return await this.kmsManager.decrypt(ciphertext);
  }
}
