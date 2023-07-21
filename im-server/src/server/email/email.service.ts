import { Injectable } from '@nestjs/common';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer/dist';
import * as dayjs from 'dayjs';
import { RedisIntance } from 'src/utils/redis';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  /**
   * 发送邮箱验证码
   * @param data 邮件主体信息
   */
  async sendEmailCode(data) {
    try {
      const code = Math.random().toString().slice(-6);
      const date = dayjs().format('YYYY年MM月DD日 HH:mm:ss');
      console.log(date);
      const sendEmailOptions: ISendMailOptions = {
        to: data.email,
        subject: data.subject || '用户邮箱验证',
        template: 'validate.code.ejs', //这里写你的模板名称，如果你的模板名称的单名如 validate.ejs ,直接写validate即可 系统会自动追加模板的后缀名,如果是多个，那就最好写全。
        context: {
          code,
          date,
          sign: data.sign || '系统邮件，回复无效',
        },
        from: '信笔科技 <xiongkangwei@sion.ink>',
        // attachments: [
        //   {
        //     filename: 'validate.code.ejs', //文件名
        //     path: path.join(
        //       process.cwd(),
        //       './src/email/template/validate.code.ejs',
        //     ), //服务端的文件地址
        //   },
        // ],
      };
      this.mailerService
        .sendMail(sendEmailOptions)
        .then(async () => {
          console.log(
            `发送邮件给:${data.email},成功!主题:${data?.subject || '默认'}`,
          );
          const redis = await RedisIntance.initRedis('email.sendEmailCode', 0);
          redis.setex(`emailCode-${data.email}`, 60 * 30, code);
        })
        .catch((error) => {
          console.log(
            `发送邮件给:${data.email}出错!主题:${data?.subject || '默认'}`,
            error,
          );
        });
      return {
        code: 200,
        msg: '发送成功',
      };
    } catch (err) {
      console.error('发送邮件出错:', err);
      return {
        code: 444,
        msg: '邮件账号有误，请核对',
      };
    }
  }
}
