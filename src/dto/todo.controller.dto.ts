import { ApiModelProperty } from '@nestjs/swagger';
import { IsString, IsDate, IsInt, MinLength, IsNumberString, IsOptional } from 'class-validator';

export class CreateTodoRequestDto {
  @ApiModelProperty({
    required: true,
    description: 'Todo title',
    minLength: 1
  })
  @IsString()
  @MinLength(1)
  readonly title: string;
}

class TodoResponseDto {
  @ApiModelProperty({
    required: true,
    example: 1
  })
  @IsInt()
  id: number;

  @ApiModelProperty({
    required: true,
    example: 'Go supermarket'
  })
  @IsString()
  title: string;

  @ApiModelProperty({
    required: true,
    description: 'Todo status',
    example: 'Active'
  })
  @IsString()
  status: string;

  @ApiModelProperty({
    example: '2019-07-07T09:18:27.263Z',
    required: true
  })
  @IsDate()
  createdOn: string;
}

export class CreateTodoResponseDto {
  @ApiModelProperty({
    required: true,
    type: TodoResponseDto
  })
  data: TodoResponseDto;
}

export class RequestTodoByIdParamDto {
  @IsNumberString()
  id: number;
}

export class GetTodoRequestQueryDto {
  @ApiModelProperty({
    required: false,
    enum: ['Active', 'Completed'],
    default: '',
    description: 'Todo status. Leave empty to search all'
  })
  @IsString()
  @IsOptional()
  status: string;
}

export class ListTodoResponseDto {
  @ApiModelProperty({
    required: true,
    type: [TodoResponseDto]
  })
  data: TodoResponseDto[];
}
