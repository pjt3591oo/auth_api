import { plainToClass } from 'class-transformer';
import { IsEnum, IsNumber, IsString, validateSync } from 'class-validator';

export enum Environment {
  LOCAL_DEVELOPMENT = 'local_dev',
}

export enum EnvKey {
  JWT_SECRET = 'JWT_SECRET',
  NODE_ENV = 'NODE_ENV',
  PORT = 'PORT',

  ENCRYPTION_KEY = 'ENCRYPTION_KEY',
  ENCRYPTION_IV = 'ENCRYPTION_IV',

  DB_HOST = 'DB_HOST',
  DB_PORT = 'DB_PORT',
  DB_USER = 'DB_USER',
  DB_PASSWORD = 'DB_PASSWORD',
  DB_DATABASE = 'DB_DATABASE',

  AWS_HOST = 'AWS_HOST',
  AWS_ACCESS_KEY_ID = 'AWS_ACCESS_KEY_ID',
  AWS_SECRET_ACCESS_KEY = 'AWS_SECRET_ACCESS_KEY',
  AWS_DEFAULT_REGION = 'AWS_DEFAULT_REGION',

  AWS_KMS_KEY_ID = 'AWS_KMS_KEY_ID',
}

class EnvironmentVariables {
  @IsString()
  JWT_KEY: string;
  @IsEnum(Environment)
  NODE_ENV: Environment;
  @IsNumber()
  PORT: number;

  @IsString()
  ENCRYPTION_KEY: string;
  @IsString()
  ENCRYPTION_IV: string;

  @IsString()
  DB_HOST: string;
  @IsNumber()
  DB_PORT: number;
  @IsString()
  DB_USER: string;
  @IsString()
  DB_PASSWORD: string;
  @IsString()
  DB_DATABASE: string;

  @IsString()
  AWS_ACCESS_KEY_ID: string;
  @IsString()
  AWS_HOST: string;
  @IsString()
  AWS_SECRET_ACCESS_KEY: string;
  @IsString()
  AWS_DEFAULT_REGION: string;

  @IsString()
  AWS_KMS_KEY_ID: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });
  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
