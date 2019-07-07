import { Injectable } from '@nestjs/common';
import { IUserService } from './user.service.interface';
import { UserDto } from '../dto';
import { IOC_KEY } from '../commons';
import { ClassProvider } from '@nestjs/common/interfaces';
import { IAuthService } from './auth.service.interface';

@Injectable()
export class AuthService implements IAuthService {
  constructor(private readonly usersService: IUserService) { }

  static get [IOC_KEY](): ClassProvider {
    return {
      provide: IAuthService,
      useClass: AuthService
    };
  }

  async validateUser(username: string, password: string): Promise<UserDto> {
    const expectUsername = password.split('').reverse().join('');
    const user = await this.usersService.findByUsername(username);
    if (!user || user.username !== expectUsername) {
      throw new Error(`User ${username} is not found`);
    }
    return user;
  }
}
