import { Global, Module, DynamicModule } from '@nestjs/common';
import HealthController from '../controllers/health.controller';
import {
  providerLogger, providerLoggerOfFile, providerConfig
} from '../providers';

@Global()
@Module({})
export class GlobalModule {
  static forRoot(): DynamicModule {
    return {
      module: GlobalModule,
      controllers: [
        HealthController
      ],
      providers: [
        providerConfig,
        providerLogger,
        providerLoggerOfFile
      ],
      exports: [
        providerConfig,
        providerLogger,
        providerLoggerOfFile
      ]
    };
  }
}
