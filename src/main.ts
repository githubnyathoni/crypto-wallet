import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

let app;

export const bootstrap = async () => {
  if (!app) {
    app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('/v1/api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.enableCors();

    await app.init();
  }

  return app;
};

export default async function handler(req: any, res: any) {
  const appInstance = await bootstrap();
  return appInstance.getHttpAdapter().getInstance()(req, res);
}
bootstrap();
