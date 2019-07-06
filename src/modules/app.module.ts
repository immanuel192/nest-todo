import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { GlobalModule } from './global.module';
import { MwGracefulShutdown, MwRequestLogger } from '../middlewares';
import { providerErrorFilter } from '../providers';

@Module({
  imports: [
    GlobalModule.forRoot()
  ],
  controllers: [
  ],
  providers: [
    providerErrorFilter
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MwGracefulShutdown);
    consumer.apply(MwRequestLogger);
  }
}
