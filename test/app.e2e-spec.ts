import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as _ from 'lodash';
import { AppModule } from '../src/modules/app.module';
import { randomString, NoopLogger, expectDateISO8601Format } from '../src/commons/test-helper';
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

      it('when creating user then got HTTP 201 with user info', () => {
        return request(app.getHttpServer())
          .post('/users')
          .set('X-Secure-Token', secureHeader)
          .send({
            username: 'trung'
          })
          .set('accept', 'json')
          .expect(201)
          .then((ret) => {
            expect(ret.body).toMatchObject({
              data: {
                id: expect.any(Number),
                username: 'trung'
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
});
