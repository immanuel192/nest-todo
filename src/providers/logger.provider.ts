import { FactoryProvider } from '@nestjs/common/interfaces';
import { IConfiguration } from '../commons/interfaces';
import { PROVIDERS } from '../commons/const';

export const providerLogger: FactoryProvider = {
  provide: PROVIDERS.ROOT_LOGGER,
  useFactory: (_config: IConfiguration) => null,
  inject: [IConfiguration]
};
