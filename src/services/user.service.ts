import { Injectable, BadRequestException } from '@nestjs/common';
import { ClassProvider } from '@nestjs/common/interfaces';
import { IUserService } from './user.service.interface';
import { IOC_KEY } from '../commons';
import { CreateUserRequestDto, UserDto } from '../dto';
import { IUserRepository } from '../repositories';

@Injectable()
export class UserService implements IUserService {
  static get [IOC_KEY](): ClassProvider {
    return {
      provide: IUserService,
      useClass: UserService
    };
  }

  constructor(
    private readonly repoUser: IUserRepository
  ) { }

  async createUser(user: CreateUserRequestDto): Promise<UserDto> {
    const existingUser = await this.repoUser.findOne({ username: user.username.toLowerCase() });
    if (existingUser) {
      throw new BadRequestException(`User ${user.username} existed`);
    }
    return this.repoUser.insertOne({
      ...user,
      username: user.username.toLowerCase(),
      createdOn: new Date()
    });
  }

  findByUsername(username: string): Promise<UserDto> {
    return this.repoUser.findOne({ username });
  }
}
