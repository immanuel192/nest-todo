import { FactoryProvider } from '@nestjs/common/interfaces';
import { IOC_KEY, PROVIDERS, IDatabaseInstance } from '../commons';
import { BaseRepository } from './base.repo';
import { UserDto, TodoDto } from '../dto';

export class IUserRepository extends BaseRepository<UserDto> {
  static get [IOC_KEY](): FactoryProvider {
    return {
      provide: IUserRepository,
      inject: [PROVIDERS.DB],
      useFactory: (db: IDatabaseInstance) => new IUserRepository(db, 'users')
    };
  }
}

export class ITodoRepository extends BaseRepository<TodoDto> {
  static get [IOC_KEY](): FactoryProvider {
    return {
      provide: ITodoRepository,
      inject: [PROVIDERS.DB],
      useFactory: (db: IDatabaseInstance) => new ITodoRepository(db, 'todos')
    };
  }
}
