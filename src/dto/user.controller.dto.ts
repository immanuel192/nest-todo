import { ApiModelProperty } from '@nestjs/swagger';
import { IsString, IsDate, IsInt, MinLength } from 'class-validator';

// This file contains all DTO for controllers
// @todo Later can refactor into multiple files if needed

export class CreateUserRequestDto {
  @ApiModelProperty({
    required: true,
    description: 'Username of new user'
  })
  @IsString()
  @MinLength(1)
  readonly username: string;
}

class UserResponseDto {
  @ApiModelProperty({
    required: true,
    example: 1
  })
  @IsInt()
  id: number;

  @ApiModelProperty({
    required: true,
    example: 'daddypig'
  })
  @IsString()
  username: string;

  @ApiModelProperty({
    example: '2019-07-07T09:18:27.263Z',
    required: true
  })
  @IsDate()
  createdOn: string;
}

export class CreateUserResponseDto {
  @ApiModelProperty({
    required: true,
    type: UserResponseDto
  })
  data: UserResponseDto;
}
