import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
// import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 允许跨域
  app.enableCors({
    credentials: true,
    origin: 'http://localhost:3000',
  });

  // 全局注册错误的过滤器
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(4000);
}
bootstrap();
