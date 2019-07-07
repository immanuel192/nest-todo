import { ApiModelProperty } from '@nestjs/swagger';
import { IsString, IsDate } from 'class-validator';

// This file contains all DTO for controllers
// @todo Later can refactor into multiple files if needed

export class CreateUserRequestDto {
  @ApiModelProperty({
    required: true,
    description: 'Username of new user'
  })
  @IsString()
  readonly username: string;
}

export class CreateUserResponseDto {
  @ApiModelProperty({
    required: true,
    example: 1
  })
  id: number;

  @ApiModelProperty({
    required: true,
    example: 'daddypig'
  })
  username: string;

  @ApiModelProperty({
    example: '2019-07-07T09:18:27.263Z',
    required: true
  })
  @IsDate()
  createdOn: string;
}
