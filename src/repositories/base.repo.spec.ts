import { BaseRepository } from './base.repo';
import { when } from '../commons/test-helper';

const expectCollectionName = 'myCollection';
const mockCollection = {
  insertOne: jest.fn(),
  findOne: jest.fn()
};

describe('/src/repositories/base.repo.ts', () => {
  let instance: BaseRepository;

  beforeAll(() => {
    const mockDb = {
      getCollection(name: string) {
        if (name === expectCollectionName) {
          return mockCollection;
        }
        return null;
      }
    };
    instance = new BaseRepository(mockDb as any, expectCollectionName);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('insertOne', () => {
    it('should insert new data, omit meta fields and return new created fields', async () => {
      const raw = { a: 1, b: 2 };
      when(mockCollection.insertOne).calledWith(raw).mockResolvedValue({
        ...raw,
        meta: { e: 1, d: 2, info: 'I am meta field' },
        $loki: 2
      });
      const newData = await instance.insertOne(raw);
      expect(newData).toMatchObject(raw);
      expect(newData).not.toHaveProperty('meta');
      expect(newData).not.toHaveProperty('$loki');
    });
  });

  describe('findOne', () => {
    it('should findOne with inp query and omit meta fields', async () => {
      const query = { a: 1, b: 2 };
      const expectValue = { name: 'trung' };

      when(mockCollection.findOne).calledWith(query).mockResolvedValue(expectValue);

      const res = await instance.findOne(query);
      expect(res).toMatchObject(expectValue);
      expect(res).not.toHaveProperty('meta');
      expect(res).not.toHaveProperty('$loki');
    });
  });
});
