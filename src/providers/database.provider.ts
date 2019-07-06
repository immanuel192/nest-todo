import { FactoryProvider } from '@nestjs/common/interfaces';
import { IConfiguration } from '../commons/interfaces';
import * as lokijs from 'lokijs';
import { PROVIDERS } from '../commons';

export const providerDatabase: FactoryProvider = {
  provide: PROVIDERS.DB,
  inject: [IConfiguration],
  useFactory: async (
    configProvider: IConfiguration
  ) => {
    const dbConfig = configProvider.get('database') as { type: string, fileName?: string };

    return await Promise.resolve().then(() => {
      const db = new lokijs(dbConfig.fileName || 'database.json', {
        persistenceMethod: dbConfig.type as any,
        autoload: true,
        autosave: true
      });
      return db;
    })
      .then(async (db) => {
        if (!db.getCollection('users')) {
          db.addCollection('users');
        }
        if (!db.getCollection('posts')) {
          db.addCollection('posts', { indices: ['userId'] });
        }
        return db;
      });
  }
};
