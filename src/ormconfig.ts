import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

process.env.ENV_PATH
  ? dotenv.config({ path: process.env.ENV_PATH })
  : dotenv.config();

export const connectionSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['dist/**/*.model.js'],
  migrations: ['dist/database/migrations/*.js'],
  synchronize: true,
  cli: {
    migrationsDir: 'src/database/migrations', // Specify the location of your migration files in the src directory
  },
} as DataSourceOptions);
