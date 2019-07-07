import { UserDto } from '../dto';

export abstract class IAuthService {
  /**
   * Validate a user by it token
   */
  abstract validateUser(username: string, password: string): Promise<UserDto>;
}
