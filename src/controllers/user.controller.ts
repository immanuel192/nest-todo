import { Controller, Post, Body, Headers, UnauthorizedException, UseInterceptors } from '@nestjs/common';
import { CreateUserRequestDto } from '../dto';
import { ApiUseTags } from '@nestjs/swagger';
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
