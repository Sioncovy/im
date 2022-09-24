import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { emailConfig } from 'src/config';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: emailConfig.host,
        port: emailConfig.port,
        auth: emailConfig.auth,
      },
      preview: true, // 是否开启预览，开启了这个属性，在调试模式下会自动打开一个网页，预览邮件
      defaults: {
        from: emailConfig.from,
      },
      template: {
        dir: `${process.cwd()}/src/server/email/template`,
        adapter: new EjsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [EmailService],
  controllers: [EmailController],
  exports: [EmailService],
})
export class EmailModule {}
