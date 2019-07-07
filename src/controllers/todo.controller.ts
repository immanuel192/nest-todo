import { Controller, Post, Body, UseGuards, UseInterceptors, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiUseTags, ApiUnauthorizedResponse, ApiCreatedResponse, ApiBadRequestResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TransformInterceptor } from '../commons/interceptors/transform.interceptor';
import { ITodoService } from '../services/todo.service.interface';
import { CreateTodoResponseDto, CreateTodoRequestDto } from '../dto';

@ApiUseTags('todos')
@UseGuards(AuthGuard())
@Controller('/todos')
export default class TodoController {
  constructor(
    private readonly todoService: ITodoService
  ) { }

  @Post('')
  @ApiBearerAuth()
  @UseInterceptors(TransformInterceptor)
  @ApiOperation({ title: 'Create new todo' })
  @ApiCreatedResponse({
    description: 'New todo has been created successfully',
    type: CreateTodoResponseDto
  })
  @ApiBadRequestResponse({})
  @ApiUnauthorizedResponse({ description: 'Unauthorised' })
  async create(
    @Body()
    inp: CreateTodoRequestDto,
    @Request()
    req: any
  ) {
    const newTodo = await this.todoService.create(inp, req.profile.id);
    return {
      id: newTodo.id,
      title: newTodo.title,
      status: newTodo.status,
      createdOn: newTodo.createdOn
    };
  }
}
