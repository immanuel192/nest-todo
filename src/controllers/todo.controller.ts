import { Controller, Post, Body, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiUseTags, ApiUnauthorizedResponse, ApiCreatedResponse, ApiBadRequestResponse, ApiOperation } from '@nestjs/swagger';
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
  @UseInterceptors(TransformInterceptor)
  @ApiOperation({ title: 'Create new todo' })
  @ApiCreatedResponse({
    description: 'New todo has been created successfully',
    type: CreateTodoResponseDto
  })
  @ApiBadRequestResponse({})
  @ApiUnauthorizedResponse({ description: 'Unauthorised' })
  create(
    @Body()
    inp: CreateTodoRequestDto
  ) {
    console.log(inp);
    console.log(this.todoService);
  }
}
