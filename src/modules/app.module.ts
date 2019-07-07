import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { GlobalModule } from './global.module';
import { IOC_KEY } from '../commons';
import { MwGracefulShutdown, MwRequestLogger } from '../middlewares';
import { providerErrorFilter, providerGlobalValidation } from '../providers';
import UserController from '../controllers/user.controller';
import TodoController from '../controllers/todo.controller';
import { UserService } from '../services/user.service';
import { IUserRepository, ITodoRepository } from '../repositories';
import { AuthService } from '../services/auth.service';
import { HttpStrategy } from '../commons/http.strategy';
import { TodoService } from '../services/todo.service';

@Module({
  imports: [
    GlobalModule.forRoot(),
    PassportModule.register({ defaultStrategy: 'basic', property: 'profile' }),
  ],
  controllers: [
    UserController,
    TodoController
  ],
  providers: [
    providerErrorFilter,
    providerGlobalValidation,
    AuthService[IOC_KEY],
    HttpStrategy,

    //
    IUserRepository[IOC_KEY],
    ITodoRepository[IOC_KEY],

    //
    UserService[IOC_KEY],
    TodoService[IOC_KEY]
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MwGracefulShutdown).forRoutes('/');
    consumer.apply(MwRequestLogger).forRoutes('/');
  }
}
