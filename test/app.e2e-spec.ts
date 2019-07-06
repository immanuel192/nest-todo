import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as _ from 'lodash';
import { AppModule } from '../src/modules/app.module';

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
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

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
