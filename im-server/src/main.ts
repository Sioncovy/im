import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 全局注册错误的过滤器
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(
    session({
      secret: 'sioncovy',
      // session 100秒过期，且不允许 js 读取
      cookie: { maxAge: 100000, httpOnly: true },
      rolling: false, // 每次重新请求时重新设置 cookie
      renew: false, //是否在Session快过期时刷新Session的有效期
      key: 'sessionId',
    }),
  );
  // 允许跨域
  app.enableCors({
    credentials: true,
    origin: 'http://localhost:3000',
  });
  await app.listen(4000);
}
bootstrap();
