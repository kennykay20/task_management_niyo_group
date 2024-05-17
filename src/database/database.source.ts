import { config } from '../config';
import { DataSource, DataSourceOptions } from 'typeorm';
// import * as path from 'path';

export const databaseSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: config.DB.HOST,
  port: config.DB.PORT,
  username: config.DB.USERNAME,
  password: config.DB.PASSWORD,
  database: config.DB.NAME,
  entities: ['dist/**/*.model.js'],
  // entities: [path.join(__dirname, '..', '**', '*.model.{js,ts}')],
  synchronize: config.isDevelopment ? true : false, // on production this will not be true but set to false
  migrations: ['dist/database/migrations/*.js'],
};

const dataSource = new DataSource(databaseSourceOptions);
export default dataSource;
