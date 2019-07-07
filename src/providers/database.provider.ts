import { FactoryProvider } from '@nestjs/common/interfaces';
import { IConfiguration, ILoggerInstance } from '../commons/interfaces';
import * as lokijs from 'lokijs';
import { PROVIDERS } from '../commons';

export const providerDatabase: FactoryProvider = {
  provide: PROVIDERS.DB,
  inject: [IConfiguration, PROVIDERS.ROOT_LOGGER],
  useFactory: async (
    configProvider: IConfiguration,
    logger: ILoggerInstance
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
          const userCollection = db.addCollection('users');
          userCollection.on('insert', (input: any) => {
            input.id = input.$loki;
          });
          // seed sample user
          logger.debug('Seeding sample user zendesk123');
          await userCollection.insert({ id: 1, username: 'zendesk123', createdOn: new Date() });
        }
        if (!db.getCollection('todos')) {
          db.addCollection('todos', { indices: ['userId', 'status'] }).on('insert', (input: any) => {
            input.id = input.$loki;
          });
        }
        return db;
      });
  }
};
