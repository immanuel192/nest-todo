import { Controller, Post, Body, UseGuards, UseInterceptors, Request, Param, Patch, BadRequestException, Delete, Get, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiUseTags, ApiUnauthorizedResponse, ApiCreatedResponse, ApiBadRequestResponse, ApiOperation, ApiBearerAuth, ApiImplicitParam, ApiNotFoundResponse, ApiForbiddenResponse, ApiResponse } from '@nestjs/swagger';
import { TransformInterceptor } from '../commons/interceptors/transform.interceptor';
import { ITodoService } from '../services/todo.service.interface';
import { CreateTodoResponseDto, CreateTodoRequestDto, RequestTodoByIdParamDto, GetTodoRequestQueryDto, ListTodoResponseDto } from '../dto';

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

  @Patch('/:id/complete')
  @ApiBearerAuth()
  @ApiImplicitParam({
    name: 'id',
    required: true,
    type: Number
  })
  @ApiOperation({ title: 'Complete a todo' })
  @ApiResponse({
    status: 200,
    description: 'Todo has been turned to complete'
  })
  @ApiBadRequestResponse({})
  @ApiUnauthorizedResponse({
    description: 'Unauthorised'
  })
  @ApiForbiddenResponse({
    description: 'Todo is not belong to authenticated user'
  })
  @ApiNotFoundResponse({
    description: 'Todo id not found'
  })
  complete(
    @Param()
    params: RequestTodoByIdParamDto,
    @Request()
    req: any
  ) {
    if (params.id < 1) {
      return Promise.reject(new BadRequestException('Todo id is invalid'));
    }
    params.id = parseInt(params.id as any, 10);
    return this.todoService.complete(params.id, req.profile.id)
      .then(() => ({}));
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @ApiImplicitParam({
    name: 'id',
    required: true,
    type: Number
  })
  @ApiOperation({ title: 'Remove a todo' })
  @ApiResponse({
    status: 200,
    description: 'Todo has been removed'
  })
  @ApiBadRequestResponse({})
  @ApiUnauthorizedResponse({
    description: 'Unauthorised'
  })
  @ApiForbiddenResponse({
    description: 'Todo is not belong to authenticated user'
  })
  @ApiNotFoundResponse({
    description: 'Todo id not found'
  })
  remove(
    @Param()
    params: RequestTodoByIdParamDto,
    @Request()
    req: any
  ) {
    if (params.id < 1) {
      return Promise.reject(new BadRequestException('Todo id is invalid'));
    }
    params.id = parseInt(params.id as any, 10);
    return this.todoService.remove(params.id, req.profile.id)
      .then(() => ({}));
  }

  @Get('')
  @ApiBearerAuth()
  @UseInterceptors(TransformInterceptor)
  @ApiOperation({ title: 'Get todos of authenticated user' })
  @ApiResponse({ status: 200, type: ListTodoResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorised' })
  list(
    @Query()
    params: GetTodoRequestQueryDto,
    @Request()
    req: any
  ) {
    return this.todoService.find({
      userId: req.profile.id,
      ...params
    });
  }
}
