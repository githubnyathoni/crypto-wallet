import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { TestService } from './test.service';
import { TestModule } from './test.module';
import * as request from 'supertest';
import { AuthService } from '../src/infrastructure/services/auth.service';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let testService: TestService;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('/v1/api');

    await app.init();

    testService = app.get(TestService);
    authService = app.get(AuthService);
  });

  describe('GET /v1/api/users/balance', () => {
    beforeEach(async () => {
      await testService.deleteUser();
    });

    it('should return user balance', async () => {
      const user = await testService.createUser();
      const acessToken = authService.generateToken(user);

      const response = await request(app.getHttpServer())
        .get('/v1/api/users/balance')
        .set('Authorization', `Bearer ${acessToken}`)
        .expect(200);

      expect(response.body.balance).toBeDefined();
    });
  });
});
