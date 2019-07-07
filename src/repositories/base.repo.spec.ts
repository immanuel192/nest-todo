import { omit } from 'lodash';
import { BaseRepository } from './base.repo';
import { when } from '../commons/test-helper';

const expectCollectionName = 'myCollection';
const mockCollection = {
  insertOne: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  findAndUpdate: jest.fn(),
  removeWhere: jest.fn()
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
      const expectValue = { name: 'trung', meta: 'abc', $loki: 2 };

      when(mockCollection.findOne).calledWith(query).mockResolvedValue(expectValue);

      const res = await instance.findOne(query);
      expect(res).toMatchObject(omit(expectValue, ['meta', '$loki']));
      expect(res).not.toHaveProperty('meta');
      expect(res).not.toHaveProperty('$loki');
    });

    it('should return undefined if can not find', async () => {
      const query = { a: 1, b: 2 };

      when(mockCollection.findOne).calledWith(query).mockResolvedValue(undefined);

      const res = await instance.findOne(query);
      expect(res).toEqual(undefined);
    });
  });

  describe('find', () => {
    it('should find with inp query and omit meta fields', async () => {
      const query = { a: 1, b: 2 };
      const expectValue = [{ name: 'trung', meta: 'abc', $loki: 2 }];

      when(mockCollection.find).calledWith(query).mockResolvedValue(expectValue);

      const res = await instance.find(query);
      expect(res[0]).toMatchObject(omit(expectValue[0], ['meta', '$loki']));
      expect(res[0]).not.toHaveProperty('meta');
      expect(res[0]).not.toHaveProperty('$loki');
    });
  });

  describe('findAndUpdate', () => {
    it('should run correctly', async () => {
      const query = { a: 1, b: 2 };
      const update = { b: 3 };
      await instance.findAndUpdate(query, update);

      //
      expect(mockCollection.findAndUpdate).toHaveBeenCalledTimes(1);
      const callArgs = mockCollection.findAndUpdate.mock.calls[0];
      expect(callArgs[0]).toMatchObject(query);
      expect(callArgs[1](query)).toMatchObject({ ...query, ...update });
    });
  });

  describe('removeByQuery', () => {
    it('should run correctly', async () => {
      const query = { a: 1, b: 2 };
      await instance.removeByQuery(query);

      //
      expect(mockCollection.removeWhere).toHaveBeenCalledTimes(1);
      expect(mockCollection.removeWhere).toBeCalledWith(query);
    });
  });
});
