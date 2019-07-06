import { Dictionary } from 'lodash';

/**
 * Transformable datatype
 */
export type TypeTransformable<T = any> = Dictionary<T> | Dictionary<T>[];

/**
 * Response transformer interface
 *
 * @export
 * @interface ITransformer
 */
export interface ITransformer<Source = any, Target = any> {
  (data: TypeTransformable<Source>): Target;
  /**
   * Response schema object
   */
  schema?: Object;
}

export type TransformOptions = ITransformer | {
  /**
   * Treat input data as it is. No need to detect whether it is an array or single object
   */
  arrayDetection?: boolean;
  /**
   * Wrap transformed output into one layer with this label
   */
  wrapLabel?: string;
  /**
  * json schema for data serialization before output to client
  */
  schema?: Object;
  transformer?: ITransformer;
};
