import { ConnectionOptions } from 'typeorm';

const config: ConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'f1fomula',
  password: 'pwf1fomula',
  database: 'f1fomulaDB',
  synchronize: true,
  logging: false,
  entities: ['./src/models/**/*.ts'],
  migrations: ['./src/migrations/**/*.ts'],
  subscribers: ['./src/subscribers/**/*.ts'],
};

export default config;
