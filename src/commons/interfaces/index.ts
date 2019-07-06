export * from './ITransformation';
export * from './ITMap';

/**
 * Configuration interface
 *
 * @interface IConfiguration
 */
export abstract class IConfiguration {
  abstract get<T = any>(name?: string, defaultValue?: T): T | null;
}

export type ILoggerInstance = {
  error?: (obj: any) => ILoggerInstance;
  warn?: (obj: any) => ILoggerInstance;
  notice?: (obj: any) => ILoggerInstance;
  info?: (obj: any) => ILoggerInstance;
  debug?: (obj: any) => ILoggerInstance;
  verbose?: (obj: any) => ILoggerInstance;
};

/**
 * Create new instance of logger with your current filename based
 *
 * @interface ILoggerOfFile
 */
export interface ILoggerOfFile {
  /**
   * Create new instance of logger with your current filename based
   */
  (filename: string): ILoggerInstance;
}
