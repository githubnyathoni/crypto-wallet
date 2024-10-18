import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { TestService } from './test.service';
import { TestModule } from './test.module';
import * as request from 'supertest';
import { AuthService } from '../src/infrastructure/services/auth.service';
import { TopUpDto } from '../src/application/dtos/topup-balance.dto';
import { TransferBalanceDto } from '../src/application/dtos/transfer-balance.dto';

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
      await testService.deleteUser('testing');
    });

    it('should return user balance', async () => {
      const user = await testService.createUser('testing');
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
      await testService.deleteUser('testing');
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
      const user = await testService.createUser('testing');
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
      const user = await testService.createUser('testing');
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
      const user = await testService.createUser('testing');
      const acessToken = authService.generateToken(user);

      const response = await request(app.getHttpServer())
        .post('/v1/api/wallet/topup')
        .send(topUpDto)
        .set('Authorization', `Bearer ${acessToken}`)
        .expect(201);

      expect(response.body.message).toBe('Topup successful');

      const updatedUser = await testService.findUser('testing');

      expect(updatedUser.balance).toBe(10000);
    });
  });

  describe('POST /v1/api/wallet/transfer', () => {
    beforeEach(async () => {
      await testService.deleteUser('testing');
      await testService.deleteUser('testing2');
    });

    it('should be return unauthorized', async () => {
      const response = await request(app.getHttpServer())
        .post('/v1/api/wallet/transfer')
        .expect(401);

      expect(response.body.message).toBe('Unauthorized');
    });

    it('should be rejected if request invalid', async () => {
      const user = await testService.createUser('testing');
      const acessToken = authService.generateToken(user);

      const transferBalanceDto: TransferBalanceDto = {
        to_username: '',
        amount: null,
      };

      const response = await request(app.getHttpServer())
        .post('/v1/api/wallet/transfer')
        .send(transferBalanceDto)
        .set('Authorization', `Bearer ${acessToken}`)
        .expect(400);

      expect(response.body.error).toBe('Bad Request');
    });

    it('should be rejected if recipient not found', async () => {
      const user = await testService.createUser('testing');
      const acessToken = authService.generateToken(user);

      const transferBalanceDto: TransferBalanceDto = {
        to_username: 'testing2',
        amount: 100,
      };

      const response = await request(app.getHttpServer())
        .post('/v1/api/wallet/transfer')
        .send(transferBalanceDto)
        .set('Authorization', `Bearer ${acessToken}`)
        .expect(404);

      expect(response.body.message).toBe('Destination user not found');
    });

    it('should be rejected if insufficient balance', async () => {
      const user = await testService.createUser('testing');
      const acessToken = authService.generateToken(user);
      await testService.createUser('testing2');

      const transferBalanceDto: TransferBalanceDto = {
        to_username: 'testing2',
        amount: 100,
      };

      const response = await request(app.getHttpServer())
        .post('/v1/api/wallet/transfer')
        .send(transferBalanceDto)
        .set('Authorization', `Bearer ${acessToken}`)
        .expect(400);

      expect(response.body.message).toBe('Insufficient balance');
    });

    it('should transfer balance successfully', async () => {
      const user = await testService.createUser('testing');
      const acessToken = authService.generateToken(user);
      await testService.createUser('testing2');
      await testService.topUpBalanceUser();

      const transferBalanceDto: TransferBalanceDto = {
        to_username: 'testing2',
        amount: 1000,
      };

      const response = await request(app.getHttpServer())
        .post('/v1/api/wallet/transfer')
        .send(transferBalanceDto)
        .set('Authorization', `Bearer ${acessToken}`)
        .expect(201);

      expect(response.body.message).toBe('Transfer success');

      const sender = await testService.findUser('testing');
      const recipient = await testService.findUser('testing2');

      expect(sender.balance).toBe(9000);
      expect(recipient.balance).toBe(1000);
    });
  });
});
