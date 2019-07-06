export * from './ITMap';

/**
 * Configuration interface
 *
 * @interface IConfiguration
 */
export abstract class IConfiguration {
  abstract get<T = any>(name?: string): T | null;
}

export type ILoggerInstance = {
  error?: (obj: any) => ILoggerInstance;
  warn?: (obj: any) => ILoggerInstance;
  notice?: (obj: any) => ILoggerInstance;
  info?: (obj: any) => ILoggerInstance;
  debug?: (obj: any) => ILoggerInstance;
  verbose?: (obj: any) => ILoggerInstance;
};
