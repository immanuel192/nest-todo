import { Injectable } from '@nestjs/common';
import { ClassProvider } from '@nestjs/common/interfaces';
import { ITodoRepository } from '../repositories';
import { IOC_KEY } from '../commons';
import { ITodoService } from './todo.service.interface';
import { TodoDto, CreateTodoRequestDto, ETodoStatus } from '../dto';

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

  async create(inp: CreateTodoRequestDto, userId: number): Promise<TodoDto> {
    return await this.repoTodo.insertOne({
      userId,
      title: inp.title,
      status: ETodoStatus.Active,
      createdOn: new Date()
    });
  }
}
