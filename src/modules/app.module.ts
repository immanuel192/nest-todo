import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { GlobalModule } from './global.module';
import { IOC_KEY } from '../commons';
import { MwGracefulShutdown, MwRequestLogger } from '../middlewares';
import { providerErrorFilter, providerGlobalValidation } from '../providers';
import UserController from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { IUserRepository } from '../repositories';

@Module({
  imports: [
    GlobalModule.forRoot()
  ],
  controllers: [
    UserController
  ],
  providers: [
    providerErrorFilter,
    providerGlobalValidation,

    //
    IUserRepository[IOC_KEY],

    //
    UserService[IOC_KEY]
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MwGracefulShutdown).forRoutes('/');
    consumer.apply(MwRequestLogger).forRoutes('/');
  }
}
