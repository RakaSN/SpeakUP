import { appConfig } from './app';
import { databaseConfig } from './database';
import { authConfig } from './auth';
import { storageConfig } from './storage';

export const config = {
  app: appConfig,
  db: databaseConfig,
  auth: authConfig,
  storage: storageConfig,
};
