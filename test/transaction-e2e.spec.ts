import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestService } from './test.service';
import { AuthService } from '../src/infrastructure/services/auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TestModule } from './test.module';

describe('TransactionController (e2e)', () => {
  let app: INestApplication;
  let testService: TestService;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('/v1/api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    testService = app.get(TestService);
    authService = app.get(AuthService);
  });

  afterAll(async () => {
    await testService.deleteUser('testing');
    await testService.deleteUser('testing2');
    await app.close();
  });

  describe('GET /v1/api/transaction/top_transactions', () => {
    beforeEach(async () => {
      await testService.deleteUser('testing');
      await testService.deleteUser('testing2');
    });

    it('should be return unauthorized', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/api/transaction/top_transactions')
        .expect(401);

      expect(response.body.message).toBe('Unauthorized');
    });

    it('should return an empty array if there are no transactions', async () => {
      const user = await testService.createUser('testing');
      const acessToken = authService.generateToken(user);

      const response = await request(app.getHttpServer())
        .get('/v1/api/transaction/top_transactions')
        .set('Authorization', `Bearer ${acessToken}`)
        .expect(200);

      expect(response.text).toBe('[]');
    });

    it('should return top 10 transactions', async () => {
      const fromUser = await testService.createUser('testing');
      const toUser = await testService.createUser('testing2');
      const acessToken = authService.generateToken(fromUser);

      await testService.topUpBalanceUser();
      await testService.createTransaction(fromUser.id, toUser.id, 1000);
      await testService.createTransaction(toUser.id, fromUser.id, 500);
      await testService.createTransaction(fromUser.id, toUser.id, 600);

      const response = await request(app.getHttpServer())
        .get('/v1/api/transaction/top_transactions')
        .set('Authorization', `Bearer ${acessToken}`)
        .expect(200);

      expect(response.body).toEqual([
        {
          username: toUser.username,
          amount: -1000,
        },
        {
          username: toUser.username,
          amount: -600,
        },
        {
          username: toUser.username,
          amount: 500,
        },
      ]);
    });
  });
});
