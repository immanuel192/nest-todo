import { FactoryProvider } from '@nestjs/common/interfaces';
import { IConfiguration } from '../commons/interfaces';
import { PROVIDERS } from '../commons/const';

export const providerLoggerOfFile: FactoryProvider = {
  provide: PROVIDERS.LOGGER_OF_FILE,
  useFactory: (_config: IConfiguration) => {
    return (_filePath: string): any => null;
  },
  inject: [IConfiguration]
};

export const providerLogger: FactoryProvider = {
  provide: PROVIDERS.ROOT_LOGGER,
  useFactory: (_config: IConfiguration) => null,
  inject: [IConfiguration]
};
