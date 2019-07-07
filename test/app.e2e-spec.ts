import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as _ from 'lodash';
import { AppModule } from '../src/modules/app.module';
import { randomString, NoopLogger, expectDateISO8601Format, DEFAULT_USERNAME, DEFAULT_PASSWORD } from '../src/commons/test-helper';
import { PROVIDERS } from '../src/commons';

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
          .then((ret) => expect(ret.text).toMatch(/username must be a string/));
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
  });
});
