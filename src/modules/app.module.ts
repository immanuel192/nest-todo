import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { GlobalModule } from './global.module';
import { IOC_KEY } from '../commons';
import { MwGracefulShutdown, MwRequestLogger } from '../middlewares';
import { providerErrorFilter, providerGlobalValidation } from '../providers';
import UserController from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { IUserRepository } from '../repositories';
import { AuthService } from '../services/auth.service';
import { HttpStrategy } from '../commons/http.strategy';

@Module({
  imports: [
    GlobalModule.forRoot(),
    PassportModule.register({ defaultStrategy: 'basic', property: 'profile' }),
  ],
  controllers: [
    UserController
  ],
  providers: [
    providerErrorFilter,
    providerGlobalValidation,
    AuthService[IOC_KEY],
    HttpStrategy,

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
