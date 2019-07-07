import { IUserService } from './user.service.interface';
import { UserService } from './user.service';
import { repoMock, when } from '../commons/test-helper';
import { IOC_KEY } from '../commons';

describe('/src/services/user.service.ts', () => {
  let instance: IUserService;
  const repoUser = repoMock();

  beforeAll(() => {
    instance = new UserService(repoUser as any);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('IoC', () => {
    it('should have class information as expected', () => {
      expect(UserService[IOC_KEY]).not.toBeUndefined();
      expect(UserService[IOC_KEY]).toMatchObject({
        provide: IUserService,
        useClass: UserService
      });

      expect(instance).not.toBeUndefined();
    });
  });

  describe('createUser', () => {
    it('should check if user already existed', () => {
      const expectUser = 'test';

      when(repoUser.findOne).calledWith({ username: expectUser }).mockResolvedValue({ a: 1 });

      return instance.createUser({ username: expectUser })
        .then(() => Promise.reject(new Error('createUser does not handle user existed case')))
        .catch((e) => {
          expect(e).toMatchObject({
            response: {
              message: `User ${expectUser} existed`
            }
          });
        });
    });

    it('should create user with username in lowercase if user not exist', () => {
      const expectUser = 'teSt';

      when(repoUser.findOne).calledWith({ username: expectUser.toLowerCase() }).mockResolvedValue(null);

      return instance.createUser({ username: expectUser })
        .then(() => {
          expect(repoUser.insertOne).toBeCalledWith({
            username: expectUser.toLowerCase(),
            createdOn: expect.any(Date)
          });
        });
    });
  });

  describe('findByUsername', () => {
    it('should find user by username', async () => {
      const expectUsername = 'test-user';
      const expectReceive = { a: 1, b: 2 };

      when(repoUser.findOne).calledWith({ username: expectUsername }).mockResolvedValue(expectReceive);

      const ret = await instance.findByUsername(expectUsername);
      expect(ret).toMatchObject(expectReceive);
    });
  });
});
