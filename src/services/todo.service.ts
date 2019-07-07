import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { ClassProvider } from '@nestjs/common/interfaces';
import { ITodoRepository } from '../repositories';
import { IOC_KEY } from '../commons';
import { ITodoService } from './todo.service.interface';
import { TodoDto, CreateTodoRequestDto, ETodoStatus, GetTodoRequestQueryDto } from '../dto';

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

  async complete(id: number, userId: number): Promise<void> {
    const todo = await this.repoTodo.findOne({ id });
    if (!todo) {
      throw new NotFoundException(`Todo ${id} is not found`);
    }
    if (todo.userId !== userId) {
      throw new ForbiddenException(`Todo ${id} is not belong to you`);
    }
    if (todo.status === ETodoStatus.Completed) {
      throw new BadRequestException(`Todo ${id} has been completed`);
    }
    await this.repoTodo.findAndUpdate({ id }, { status: ETodoStatus.Completed });
  }

  async remove(id: number, userId: number): Promise<void> {
    const todo = await this.repoTodo.findOne({ id });
    if (!todo) {
      throw new NotFoundException(`Todo ${id} is not found`);
    }
    if (todo.userId !== userId) {
      throw new ForbiddenException(`Todo ${id} is not belong to you`);
    }
    await this.repoTodo.removeByQuery({ id });
  }

  find(query: GetTodoRequestQueryDto & { userId: number }): Promise<TodoDto[]> {
    const findQuery: any = {
      userId: query.userId
    };
    if (query.status === ETodoStatus.Active || query.status === ETodoStatus.Completed) {
      findQuery.status = query.status;
    }
    return this.repoTodo.find(findQuery);
  }
}
