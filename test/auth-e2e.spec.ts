import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestService } from './test.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { TestModule } from './test.module';
import * as request from 'supertest';
import { CreateUserDto } from '../src/application/dtos/create-user.dto';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let testService: TestService;

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
  });

  describe('POST /v1/api/auth/register', () => {
    beforeEach(async () => {
      await testService.deleteUser();
    });

    it('should be rejected if request is invalid', async () => {
      const registerDto: CreateUserDto = {
        username: '',
        password: '',
      };

      const response = await request(app.getHttpServer())
        .post('/v1/api/auth/register')
        .send(registerDto)
        .expect(400);

      expect(response.body.message).toBeDefined();
      expect(response.body.error).toBe('Bad Request');
    });

    it('should be able to register', async () => {
      const registerDto: CreateUserDto = {
        username: 'testing',
        password: 'testing',
      };

      const response = await request(app.getHttpServer())
        .post('/v1/api/auth/register')
        .send(registerDto)
        .expect(201);

      expect(response.body.username).toBe('testing');
      expect(response.body.access_token).toBeDefined();
    });

    it('should be rejected if email already exists', async () => {
      await testService.createUser();

      const registerDto: CreateUserDto = {
        username: 'testing',
        password: 'testing',
      };

      const response = await request(app.getHttpServer())
        .post('/v1/api/auth/register')
        .send(registerDto)
        .expect(409);

      expect(response.body.message).toBe('Username already exists');
      expect(response.body.error).toBe('Conflict');
    });
  });
});
