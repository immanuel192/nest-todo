import { IConfiguration } from '../commons/interfaces';
import { FactoryProvider } from '@nestjs/common/interfaces';

function getConfigurationInstance(): IConfiguration {
  return {
    get() {
      return null;
    }
  };
}

export const providerConfig: FactoryProvider = {
  provide: IConfiguration,
  useFactory: () => getConfigurationInstance()
};
