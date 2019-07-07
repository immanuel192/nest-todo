import { omit } from 'lodash';
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
    return await this.collection.findOne(query);
  }
}
