import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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
    const config = new DocumentBuilder()
      .setTitle('Task Management API')
      .setDescription('API documentation with Zod validation')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/v1/docs', app, document);

    await app.listen(3000);
  }

  return app;
};

export default async function handler(req: any, res: any) {
  const appInstance = await bootstrap();

  return appInstance.getHttpAdapter().getInstance()(req, res);
}
bootstrap();
