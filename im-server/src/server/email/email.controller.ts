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
    console.log(data);
    return await this.emailService.sendeMailCode(data);
  }
}
