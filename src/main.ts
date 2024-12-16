import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('Backend Template API')
  .setDescription('API documentation for the NestJS backend template')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

async function setupSwagger(app) {
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  setupSwagger(app);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
