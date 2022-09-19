import { Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { Public } from 'src/decorators/public.decorator';
import { Body } from '@nestjs/common/decorators';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Public()
  @Post('sendCode')
  async sendEmailCode(@Body() data) {
    if (!data?.email) {
      return {
        code: 444,
        msg: '请输入邮箱账号！',
      };
    }
    return await this.emailService.sendEmailCode(data);
  }
}
