import { omit, merge } from 'lodash';
import { Collection } from 'lokijs';
import { IDatabaseInstance } from '../commons';

export class BaseRepository<TModel extends Object = any> {
  protected collection: Collection<TModel>;

  constructor(
    db: IDatabaseInstance, collectionName: string
  ) {
    this.collection = db.getCollection(collectionName);
  }

  /**
   * Insert new record
   */
  async insertOne(data: Partial<TModel>): Promise<TModel> {
    const newData = await this.collection.insertOne(data as any);
    return omit(newData, ['meta', '$loki']) as any;
  }

  async findOne(query: any): Promise<TModel> {
    const ret = await this.collection.findOne(query);
    return ret ? omit(ret, ['meta', '$loki']) as any : undefined;
  }

  async find(query: any): Promise<TModel[]> {
    const ret = await this.collection.find(query);
    return ret.map(r => omit(r, ['meta', '$loki']) as any);
  }

  async findAndUpdate(query: PartialModel<TModel, any>, update: PartialModel<TModel, any>): Promise<void> {
    this.collection.findAndUpdate(query as any, obj => merge(obj, update));
  }

  async removeByQuery(query: PartialModel<TModel, any>): Promise<void> {
    await this.collection.removeWhere(query as any);
  }
}
