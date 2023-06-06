import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

import { EnvKey } from 'src/common/env.validator';

@Injectable()
export class S3Upload {
  private s3: S3Client;
  private tokenBlackListBucketName = 'token-blacklist-backup';

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3Client({
      region: this.configService.get(EnvKey.AWS_DEFAULT_REGION),
      credentials: {
        accessKeyId: this.configService.get(EnvKey.AWS_ACCESS_KEY_ID),
        secretAccessKey: this.configService.get(EnvKey.AWS_SECRET_ACCESS_KEY),
      },
      endpoint: this.configService.get(EnvKey.AWS_HOST),
    });
  }

  async toTokenBlacklistBackupUploadFile(filePath: string) {
    const fileContent = fs.readFileSync(filePath);

    const uploadParams = {
      Bucket: this.tokenBlackListBucketName,
      Key: filePath.substring(filePath.lastIndexOf('/') + 1), // Use the filename as the S3 key
      Body: fileContent,
    };

    const putObjectCommand = new PutObjectCommand(uploadParams);
    const uploadResponse = await this.s3.send(putObjectCommand);

    return uploadResponse;
  }
}
