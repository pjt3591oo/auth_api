import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { EnvKey } from '../env.validator';
import * as path from 'path';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: config.get(EnvKey.DB_HOST),
        port: config.get(EnvKey.DB_PORT),
        database: config.get(EnvKey.DB_DATABASE),
        username: config.get(EnvKey.DB_USER),
        password: config.get(EnvKey.DB_PASSWORD),
        entities: [path.resolve(`${__dirname}/../../**/**.entity{.ts,.js}`)],
        synchronize: true,
        logging: true,
      });

      return dataSource.initialize();
    },
  },
];
