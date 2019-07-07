import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

// This file contains all DTO for controllers
// @todo Later can refactor into multiple files if needed

export class CreateUserRequestDto {
  @ApiModelProperty({ required: true })
  @IsString()
  readonly username: string;
}
