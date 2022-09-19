import { Injectable } from '@nestjs/common';
import * as svgCaptcha from 'svg-captcha';

@Injectable()
export class ToolsService {
  async captCha(size = 4) {
    const captcha = svgCaptcha.create({
      size, // 生成的验证码内文字数量
      fontSize: 38, // 文字大小
      ignoreChars: '0oO1iIlL',
      width: 100,
      height: 36,
      noise: 1,
      color: true,
    });
    return captcha;
  }
}
