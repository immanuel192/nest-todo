import { UserDto, CreateUserRequestDto } from '../dto';

/**
 * User service
 */
export abstract class IUserService {
  /**
   * Create new user. This function will check if giving username is already existed or not
   */
  abstract createUser(user: CreateUserRequestDto): Promise<UserDto>;

  /**
   * Find a user by username
   */
  abstract findByUsername(username: string): Promise<UserDto>;
}
