import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as _ from 'lodash';
import { AppModule } from '../src/modules/app.module';
import { randomString, NoopLogger, expectDateISO8601Format, DEFAULT_USERNAME, DEFAULT_PASSWORD } from '../src/commons/test-helper';
import { PROVIDERS } from '../src/commons';
import { IUserService } from '../src/services';
import { ITodoService } from '../src/services/todo.service.interface';
import { TodoDto, ETodoStatus } from '../src/dto';
import { ITodoRepository } from '../src/repositories';

/**
 * Integration test for Jobs
 */
describe('/src/app.ts', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        AppModule
      ]
    })
      .overrideProvider(PROVIDERS.ROOT_LOGGER)
      .useValue(NoopLogger)
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Common', () => {
    describe('GET /health', () => {
      it('should return HTTP 200', () => {
        return request(app.getHttpServer())
          .get('/health')
          .expect(200)
          .then((res) => {
            expect(res.body).toMatchObject({
              name: 'nest-todo',
              version: expect.anything()
            });
          });
      });
    });

    describe('HEAD /health', () => {
      it('should return HTTP 200', () => {
        return request(app.getHttpServer())
          .head('/health')
          .expect(200);
      });
    });
  });

  describe('Users', () => {
    const sampleUser = {
      username: randomString()
    };
    const secureHeader = 'zendesk';

    describe('creating user', () => {
      it('when creating user without secure token then return HTTP 401', () => {
        return request(app.getHttpServer())
          .post('/users')
          .send(sampleUser)
          .set('accept', 'json')
          .expect(401);
      });

      it('when creating user without username then return HTTP 400', () => {
        return request(app.getHttpServer())
          .post('/users')
          .set('X-Secure-Token', secureHeader)
          .send({})
          .set('accept', 'json')
          .expect(400)
          .then(ret => expect(ret.text).toMatch(/username must be a string/));
      });

      it('when creating user then got HTTP 201 with user name in lowercase', () => {
        return request(app.getHttpServer())
          .post('/users')
          .set('X-Secure-Token', secureHeader)
          .send({
            username: 'trUNg'
          })
          .set('accept', 'json')
          .expect(201)
          .then((ret) => {
            expect(ret.body).toMatchObject({
              data: {
                id: expect.any(Number),
                username: 'trung',
                createdOn: expectDateISO8601Format
              }
            });
          });
      });

      it('when creating user with existing username then got HTTP 400', () => {
        return request(app.getHttpServer())
          .post('/users')
          .set('X-Secure-Token', secureHeader)
          .send({
            username: 'trung'
          })
          .set('accept', 'json')
          .expect(400)
          .then((ret) => {
            expect(ret.body).toMatchObject({
              statusCode: 400,
              message: 'User trung existed',
              timestamp: expectDateISO8601Format,
              uri: '/users',
              method: 'POST'
            });
          });
      });
    });
  });

  describe('Todo', () => {
    let todoService: ITodoService;
    let repoTodo: ITodoRepository;

    const firstUser = { id: 0, username: randomString(), password: '' };
    const secondUser = { id: 0, username: randomString(), password: '' };

    beforeAll(async () => {
      todoService = app.get(ITodoService);
      repoTodo = app.get(ITodoRepository);

      firstUser.password = firstUser.username.split('').reverse().join('');
      secondUser.password = secondUser.username.split('').reverse().join('');

      const userService = app.get(IUserService);
      let user = await userService.createUser({ username: firstUser.username });
      firstUser.id = user.id;
      user = await userService.createUser({ username: secondUser.username });
      secondUser.id = user.id;
    });

    describe('Add todo', () => {
      it('when adding todo without Authorization then return HTTP 401', () => {
        return request(app.getHttpServer())
          .post('/todos')
          .auth(randomString(), randomString(), { type: 'basic' })
          .send({ title: 'my todo' })
          .set('accept', 'json')
          .expect(401);
      });

      it('when adding todo with out title then return HTTP 400', () => {
        return request(app.getHttpServer())
          .post('/todos')
          .auth(DEFAULT_USERNAME, DEFAULT_PASSWORD, { type: 'basic' })
          .send({ title2: 'my todo' })
          .set('accept', 'json')
          .expect(400);
      });

      it('when adding todo without title then return HTTP 400', () => {
        return request(app.getHttpServer())
          .post('/todos')
          .auth(DEFAULT_USERNAME, DEFAULT_PASSWORD, { type: 'basic' })
          .send({ title: '' })
          .set('accept', 'json')
          .expect(400);
      });

      it('when adding todo then receive HTTP 201 with todo info', () => {
        const myTitle = randomString();
        return request(app.getHttpServer())
          .post('/todos')
          .auth(DEFAULT_USERNAME, DEFAULT_PASSWORD, { type: 'basic' })
          .send({ title: myTitle })
          .set('accept', 'json')
          .expect(201)
          .then((ret) => {
            expect(ret.body.data).toMatchObject({
              id: expect.any(Number),
              title: myTitle,
              status: 'Active',
              createdOn: expectDateISO8601Format
            });
            expect(ret.body.data).not.toHaveProperty('userId');
          });
      });
    });

    describe('Complete Todo', () => {
      let firstTodo: TodoDto;
      let secondTodo: TodoDto;

      beforeAll(async () => {
        firstTodo = await todoService.create({ title: randomString() }, firstUser.id);
        secondTodo = await todoService.create({ title: randomString() }, secondUser.id);
      });

      it('when complete todo without Authorization then return HTTP 401', () => {
        return request(app.getHttpServer())
          .patch('/todos/1/complete')
          .auth(randomString(), randomString(), { type: 'basic' })
          .set('accept', 'json')
          .expect(401);
      });

      it('when complete todo with invalid id data type then return HTTP 400', () => {
        return request(app.getHttpServer())
          .patch('/todos/abc/complete')
          .auth(firstUser.username, firstUser.password, { type: 'basic' })
          .set('accept', 'json')
          .expect(400);
      });

      it('when complete todo with id less than 1 then return HTTP 400', () => {
        return request(app.getHttpServer())
          .patch('/todos/0/complete')
          .auth(firstUser.username, firstUser.password, { type: 'basic' })
          .set('accept', 'json')
          .expect(400)
          .then((ret) => {
            expect(ret.body).toMatchObject({ message: 'Todo id is invalid' });
          });
      });

      it('when complete todo with not exist id then return HTTP 404', () => {
        return request(app.getHttpServer())
          .patch(`/todos/${(firstTodo.id * 10)}/complete`)
          .auth(firstUser.username, firstUser.password, { type: 'basic' })
          .set('accept', 'json')
          .expect(404)
          .then((ret) => {
            expect(ret.body).toMatchObject({
              message: `Todo ${(firstTodo.id * 10)} is not found`
            });
          });
      });

      it('when complete existing todo which belong to other user then return HTTP 403', () => {
        return request(app.getHttpServer())
          .patch(`/todos/${secondTodo.id}/complete`)
          .auth(firstUser.username, firstUser.password, { type: 'basic' })
          .set('accept', 'json')
          .expect(403)
          .then((ret) => {
            expect(ret.body).toMatchObject({
              message: `Todo ${secondTodo.id} is not belong to you`
            });
          });
      });

      it('when complete todo then return HTTP 200', () => {
        return request(app.getHttpServer())
          .patch(`/todos/${firstTodo.id}/complete`)
          .auth(firstUser.username, firstUser.password, { type: 'basic' })
          .set('accept', 'json')
          .expect(200)
          .then(async () => {
            const todo = await repoTodo.findOne({ id: firstTodo.id });
            expect(todo.status).toEqual(ETodoStatus.Completed);
          });
      });

      it('when complete todo which has been completed then return HTTP 400', () => {
        return request(app.getHttpServer())
          .patch(`/todos/${firstTodo.id}/complete`)
          .auth(firstUser.username, firstUser.password, { type: 'basic' })
          .set('accept', 'json')
          .expect(400)
          .then((ret) => {
            expect(ret.body).toMatchObject({
              message: `Todo ${firstTodo.id} has been completed`
            });
          });
      });
    });

    describe('Remove Todo', () => {
      let firstTodo: TodoDto;

      beforeAll(async () => {
        firstTodo = await todoService.create({ title: randomString() }, firstUser.id);
      });

      it('when remove todo without Authorization then return HTTP 401', () => {
        return request(app.getHttpServer())
          .delete('/todos/1')
          .auth(randomString(), randomString(), { type: 'basic' })
          .set('accept', 'json')
          .expect(401);
      });

      it('when remove todo with invalid id data type then return HTTP 400', () => {
        return request(app.getHttpServer())
          .delete('/todos/abc')
          .auth(firstUser.username, firstUser.password, { type: 'basic' })
          .set('accept', 'json')
          .expect(400);
      });

      it('when remove todo with id less than 1 then return HTTP 400', () => {
        return request(app.getHttpServer())
          .delete('/todos/0')
          .auth(firstUser.username, firstUser.password, { type: 'basic' })
          .set('accept', 'json')
          .expect(400)
          .then((ret) => {
            expect(ret.body).toMatchObject({ message: 'Todo id is invalid' });
          });
      });

      it('when remove todo with not exist id then return HTTP 404', () => {
        return request(app.getHttpServer())
          .delete(`/todos/${(firstTodo.id * 10)}`)
          .auth(firstUser.username, firstUser.password, { type: 'basic' })
          .set('accept', 'json')
          .expect(404)
          .then((ret) => {
            expect(ret.body).toMatchObject({
              message: `Todo ${(firstTodo.id * 10)} is not found`
            });
          });
      });

      it('when remove existing todo which belong to other user then return HTTP 403', () => {
        return request(app.getHttpServer())
          .delete(`/todos/${firstTodo.id}`)
          .auth(secondUser.username, secondUser.password, { type: 'basic' })
          .set('accept', 'json')
          .expect(403)
          .then((ret) => {
            expect(ret.body).toMatchObject({
              message: `Todo ${firstTodo.id} is not belong to you`
            });
          });
      });

      it('when remove todo then return HTTP 200', () => {
        return request(app.getHttpServer())
          .delete(`/todos/${firstTodo.id}`)
          .auth(firstUser.username, firstUser.password, { type: 'basic' })
          .set('accept', 'json')
          .expect(200)
          .then(async () => {
            const todo = await repoTodo.findOne({ id: firstTodo.id });
            expect(todo).toEqual(undefined);
          });
      });
    });

    describe('List Todo', () => {
      const firstUserTodos: TodoDto[] = [];
      const secondUserTodos: TodoDto[] = [];
      const firstUser = { id: 0, username: randomString(), password: '' };
      const secondUser = { id: 0, username: randomString(), password: '' };

      beforeAll(async () => {
        // seed data
        firstUser.password = firstUser.username.split('').reverse().join('');
        secondUser.password = secondUser.username.split('').reverse().join('');

        const userService = app.get(IUserService);
        let user = await userService.createUser({ username: firstUser.username });
        firstUser.id = user.id;
        user = await userService.createUser({ username: secondUser.username });
        secondUser.id = user.id;

        //
        for (let i = 0; i < 5; i++) {
          firstUserTodos.push(await todoService.create({ title: randomString() }, firstUser.id));
          secondUserTodos.push(await todoService.create({ title: randomString() }, secondUser.id));
        }
        // Complete one
        await todoService.complete(firstUserTodos[firstUserTodos.length - 1].id, firstUser.id);
      });

      it('when list todo without Authorization then return HTTP 401', () => {
        return request(app.getHttpServer())
          .get('/todos')
          .auth(randomString(), randomString(), { type: 'basic' })
          .set('accept', 'json')
          .expect(401);
      });

      it('when list todo then return list of todo of authenticated user and HTTP 200', () => {
        return request(app.getHttpServer())
          .get('/todos')
          .auth(firstUser.username, firstUser.password, { type: 'basic' })
          .set('accept', 'json')
          .expect(200)
          .then(async (ret) => {
            const data = ret.body.data.map((t: any) => t.id);
            const firstUserTodoIds = firstUserTodos.map(t => t.id);
            const secondUserTodoIds = secondUserTodos.map(t => t.id);
            const diff = _.difference(data, firstUserTodoIds);
            const diff2 = _.difference(secondUserTodoIds, data);
            expect(diff.length).toEqual(0);
            expect(diff2.length).toEqual(secondUserTodoIds.length);
            expect(data.length).toEqual(firstUserTodoIds.length);
          });
      });

      it('when list Completed todos then list of todo of authenticated user and HTTP 200', () => {
        return request(app.getHttpServer())
          .get('/todos?status=' + ETodoStatus.Completed)
          .auth(firstUser.username, firstUser.password, { type: 'basic' })
          .set('accept', 'json')
          .expect(200)
          .then(async (ret) => {
            expect(ret.body.data).toHaveLength(1);
            expect(ret.body.data[0]).toMatchObject({
              id: firstUserTodos[firstUserTodos.length - 1].id,
              userId: firstUserTodos[firstUserTodos.length - 1].userId
            });
          });
      });

      it('when list Active todos then list of todo of authenticated user and HTTP 200', () => {
        return request(app.getHttpServer())
          .get('/todos?status=' + ETodoStatus.Active)
          .auth(firstUser.username, firstUser.password, { type: 'basic' })
          .set('accept', 'json')
          .expect(200)
          .then(async (ret) => {
            expect(ret.body.data).toHaveLength(firstUserTodos.length - 1);
            const data = ret.body.data.map((t: any) => t.id);
            const firstUserTodoIds = firstUserTodos.map(t => t.id).slice(0, firstUserTodos.length - 1).sort();
            expect(data.sort()).toEqual(firstUserTodoIds);
          });
      });
    });
  });
});
