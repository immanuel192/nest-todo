import { Controller, Post, Body, Headers, UnauthorizedException, UseInterceptors } from '@nestjs/common';
import { CreateUserRequestDto, CreateUserResponseDto } from '../dto';
import { ApiUseTags, ApiUnauthorizedResponse, ApiCreatedResponse, ApiBadRequestResponse, ApiOperation } from '@nestjs/swagger';
import { IUserService } from '../services';
import { TransformInterceptor } from '../commons/interceptors/transform.interceptor';

@ApiUseTags('users')
@Controller('/users')
export default class UserController {
  constructor(
    private readonly userService: IUserService
  ) { }

  @UseInterceptors(TransformInterceptor)
  @Post('')
  @ApiOperation({ title: 'Create user' })
  @ApiCreatedResponse({ description: 'User has been successfully created.', type: CreateUserResponseDto })
  @ApiBadRequestResponse({})
  @ApiUnauthorizedResponse({ description: 'Unauthorised' })
  create(
    @Body()
    user: CreateUserRequestDto,
    @Headers('x-secure-token')
    secureHeader: string
  ) {
    if (secureHeader !== 'zendesk') {
      throw new UnauthorizedException();
    }
    return this.userService.createUser(user);
  }
}
