import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

let cachedApp = null;

export const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/v1/api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableCors();

  await app.listen(3000);

  return app;
};

export default async function handler(req: any, res: any) {
  const appInstance = await bootstrap();
  return appInstance.getHttpServer()(req, res);
}
