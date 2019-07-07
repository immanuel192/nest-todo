import { UserDto, CreateUserRequestDto } from '../dto';

/**
 * User service
 */
export abstract class IUserService {
  abstract createUser(user: CreateUserRequestDto): Promise<UserDto>;
}
