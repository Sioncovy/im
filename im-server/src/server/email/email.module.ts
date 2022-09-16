import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.exmail.qq.com', //邮箱服务器地址
        port: 465, //服务器端口 默认 465
        auth: {
          user: 'mailpen@sioncovy.top',
          pass: '5J2fhhRhtY2WGqoD',
        },
      },
      preview: true, // 是否开启预览，开启了这个属性，在调试模式下会自动打开一个网页，预览邮件
      defaults: {
        from: '信笔科技 <mailpen@sioncovy.top>',
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
