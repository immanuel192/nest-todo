import { repoMock } from '../commons/test-helper';
import { IOC_KEY } from '../commons';
import { ITodoService } from './todo.service.interface';
import { TodoService } from './todo.service';
import { ETodoStatus } from '../dto';

describe('/src/services/todo.service.ts', () => {
  let instance: ITodoService;
  const repoTodo = repoMock();

  beforeAll(() => {
    instance = new TodoService(repoTodo as any);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('IoC', () => {
    it('should have class information as expected', () => {
      expect(TodoService[IOC_KEY]).not.toBeUndefined();
      expect(TodoService[IOC_KEY]).toMatchObject({
        provide: ITodoService,
        useClass: TodoService
      });

      expect(instance).not.toBeUndefined();
    });
  });

  describe('create', () => {
    it('should create new todo with default value', async () => {
      const inp = { title: 'todo title' };
      const userId = 99;
      const expectReceive = { a: 1, b: 2 };
      repoTodo.insertOne.mockResolvedValue(expectReceive);

      const ret = await instance.create(inp, userId);
      expect(ret).toMatchObject(expectReceive);
      expect(repoTodo.insertOne).toBeCalledWith({
        userId,
        title: inp.title,
        status: ETodoStatus.Active,
        createdOn: expect.any(Date)
      });
    });
  });
});
