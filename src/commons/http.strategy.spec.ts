import { when } from './test-helper';
import { HttpStrategy } from './http.strategy';
import { UnauthorizedException } from '@nestjs/common';

const mockAuthService = {
  validateUser: jest.fn()
};

describe('/src/commons/http.strategy.ts', () => {
  let instance: HttpStrategy;

  beforeAll(() => {
    instance = new HttpStrategy(mockAuthService as any);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('validate', () => {
    const expectUsername = 'dadypig';
    const expectPassword = 'gipydad';

    it('should return user if user exist and valid', () => {
      const expectUser = { a: 1, b: 2 };
      when(mockAuthService.validateUser).calledWith(expectUsername, expectPassword).mockResolvedValue(expectUser);

      return instance.validate(expectUsername, expectPassword)
        .then((user) => {
          expect(user).toMatchObject(expectUser);
        });
    });

    it('should throw UnauthorizedException if can not validate user', () => {
      when(mockAuthService.validateUser).calledWith(expectUsername, expectPassword).mockRejectedValue(null);

      return instance.validate(expectUsername, expectPassword)
        .then(() => Promise.reject('validate does not behave correct when user not valid'))
        .catch((e) => {
          expect(e).toBeInstanceOf(UnauthorizedException);
        });
    });
  });
});
