import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './server/user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/auth.guard';
import { EmailModule } from './server/email/email.module';
import { config } from './config';
import { ChatModule } from './server/chat/chat.module';
import { ChatGateway } from './server/chat/chat.gateway';
import { ContactModule } from './server/contact/contact.module';
import { FileModule } from './server/file/file.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';

@Module({
  imports: [
    MongooseModule.forRoot(
      `${config.mongodb.host}:${config.mongodb.port}/${config.mongodb.database}`,
    ),
    UserModule,
    AuthModule,
    EmailModule,
    ChatModule,
    ContactModule,
    FileModule,
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'uploads'),
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    ChatGateway,
  ],
})
export class AppModule {}
