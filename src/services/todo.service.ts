import { Injectable } from '@nestjs/common';
import { ClassProvider } from '@nestjs/common/interfaces';
import { ITodoRepository } from '../repositories';
import { IOC_KEY } from '../commons';
import { ITodoService } from './todo.service.interface';

@Injectable()
export class TodoService implements ITodoService {
  static get [IOC_KEY](): ClassProvider {
    return {
      provide: ITodoService,
      useClass: TodoService
    };
  }

  constructor(
    private readonly repoTodo: ITodoRepository
  ) { }

}
