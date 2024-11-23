import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { ResponseInterceptor } from './application/interceptors/response.interceptor';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (process.env.DEV == '1') {
    const options = new DocumentBuilder()
      .setTitle('BJS Backend')
      .setDescription('This is API documentation for BJS')
      .setVersion('1.0')
      .addTag('BJS')
      .addBearerAuth()
      .addBasicAuth()
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('docs', app, document);
  }
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ResponseInterceptor(new Reflector()));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
