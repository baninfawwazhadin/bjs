import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const dbPort = process.env.DB_PORT ? +process.env.DB_PORT : 3306;
const dbType = process.env.DB_TYPE as
  | 'mysql'
  | 'mariadb'
  | 'postgres'
  | 'sqlite';

if (!['mysql', 'mariadb', 'postgres', 'sqlite'].includes(dbType)) {
  throw new Error(`Unsupported DB type: ${dbType}`);
}

export const dataSourceOptions = {
  type: dbType,
  host: process.env.DB_HOST,
  port: dbPort,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [join(__dirname, '../shared/entities/**/*.entity{.ts,.js}')],
  logging: true,
} as DataSourceOptions;

export const AppDataSource = new DataSource(dataSourceOptions);
