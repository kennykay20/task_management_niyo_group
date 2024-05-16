import { Module } from '@nestjs/common';
import { config } from '../config';
import * as path from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: config.DB.HOST,
        port: config.DB.PORT,
        username: config.DB.USERNAME,
        password: config.DB.PASSWORD,
        database: config.DB.NAME,
        entities: [path.join(__dirname, '..', '**', '*.model.{js,ts}')],
        synchronize: true, // on production this will not be true but set to false
      }),
      dataSourceFactory: async (options) => {
        const dataSource = await new DataSource(options).initialize();
        return dataSource;
      },
    }),
  ],
  exports: [],
})
export class DatabaseModule {}
