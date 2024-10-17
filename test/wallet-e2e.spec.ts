import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { TestService } from './test.service';
import { TestModule } from './test.module';
import * as request from 'supertest';
import { AuthService } from '../src/infrastructure/services/auth.service';
import { TopUpDto } from '../src/application/dtos/topup-balance.dto';

describe('WalletController (e2e)', () => {
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

  describe('GET /v1/api/wallet/balance', () => {
    beforeEach(async () => {
      await testService.deleteUser();
    });

    it('should return user balance', async () => {
      const user = await testService.createUser();
      const acessToken = authService.generateToken(user);

      const response = await request(app.getHttpServer())
        .get('/v1/api/wallet/balance')
        .set('Authorization', `Bearer ${acessToken}`)
        .expect(200);

      expect(response.body.balance).toBeDefined();
    });
  });

  describe('POST /v1/api/wallet/topup', () => {
    beforeEach(async () => {
      await testService.deleteUser();
    });

    it('should be return unauthorized', async () => {
      const response = await request(app.getHttpServer())
        .post('/v1/api/wallet/topup')
        .expect(401);

      expect(response.body.message).toBe('Unauthorized');
    });

    it('should be rejected if amount is not positive number', async () => {
      const topUpDto: TopUpDto = {
        amount: 0,
      };
      const user = await testService.createUser();
      const acessToken = authService.generateToken(user);

      const response = await request(app.getHttpServer())
        .post('/v1/api/wallet/topup')
        .send(topUpDto)
        .set('Authorization', `Bearer ${acessToken}`)
        .expect(400);

      expect(response.body.error).toBe('Bad Request');
    });

    it('should be rejected if amount is more than equal 10.000.000', async () => {
      const topUpDto: TopUpDto = {
        amount: 15000000,
      };
      const user = await testService.createUser();
      const acessToken = authService.generateToken(user);

      const response = await request(app.getHttpServer())
        .post('/v1/api/wallet/topup')
        .send(topUpDto)
        .set('Authorization', `Bearer ${acessToken}`)
        .expect(400);

      expect(response.body.error).toBe('Bad Request');
    });

    it('should be successfully top up balance', async () => {
      const topUpDto: TopUpDto = {
        amount: 10000,
      };
      const user = await testService.createUser();
      const acessToken = authService.generateToken(user);

      const response = await request(app.getHttpServer())
        .post('/v1/api/wallet/topup')
        .send(topUpDto)
        .set('Authorization', `Bearer ${acessToken}`)
        .expect(201);

      expect(response.body.message).toBe('Topup successful');

      const updatedUser = await testService.findUser();

      expect(updatedUser.balance).toBe(10000);
    });
  });
});
