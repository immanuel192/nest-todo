import { when } from '../commons/test-helper';
import { IOC_KEY } from '../commons';
import { IAuthService } from './auth.service.interface';
import { AuthService } from './auth.service';

describe('/src/services/auth.service.ts', () => {
  let instance: IAuthService;
  const userService = {
    findByUsername: jest.fn()
  };

  beforeAll(() => {
    instance = new AuthService(userService as any);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('IoC', () => {
    it('should have class information as expected', () => {
      expect(AuthService[IOC_KEY]).not.toBeUndefined();
      expect(AuthService[IOC_KEY]).toMatchObject({
        provide: IAuthService,
        useClass: AuthService
      });

      expect(instance).not.toBeUndefined();
    });
  });

  describe('validateUser', () => {
    const expectUsername = 'dadypig';
    const expectPassword = 'gipydad';

    it('should validate user if valid username and password', async () => {
      const expectUser = { a: 1, b: 2, username: expectUsername };
      when(userService.findByUsername)
        .calledWith(expectUsername).mockResolvedValue(expectUser);

      const user = await instance.validateUser(expectUsername, expectPassword);
      expect(user).toMatchObject(expectUser);
    });

    it('should throw exception if can not find user', () => {
      userService.findByUsername.mockReturnValue(null);
      return instance.validateUser(expectUsername, expectPassword)
        .catch((e) => {
          expect(e).toMatchObject({
            message: `User ${expectUsername} is not found`
          });
        });
    });

    it('should throw exception if password not match', () => {
      const expectUser = { a: 1, b: 2, username: expectUsername };
      when(userService.findByUsername)
        .calledWith(expectUsername).mockResolvedValue(expectUser);
      return instance.validateUser(expectUsername, 'fake password')
        .catch((e) => {
          expect(e).toMatchObject({
            message: `User ${expectUsername} is not found`
          });
        });
    });
  });
});
