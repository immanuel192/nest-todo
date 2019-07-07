import { BasicStrategy } from 'passport-http';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IAuthService } from '../services';

@Injectable()
export class HttpStrategy extends PassportStrategy(BasicStrategy) {
  constructor(private readonly authService: IAuthService) {
    super();
  }

  validate(username: string, password: string) {
    return this.authService.validateUser(username, password)
      .catch(() => Promise.reject(new UnauthorizedException()));
  }
}
