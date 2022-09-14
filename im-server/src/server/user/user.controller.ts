import { Body, Session, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { User, Login } from './user.interface';
import { UserService } from './user.service';
import { ToolsService } from 'src/utils/tools.service';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private toolsService: ToolsService,
  ) {}

  @Post('login')
  async login(@Body() accountInfo: Login, @Session() session): Promise<any> {
    if (session.code !== accountInfo.code) {
      return {
        code: 403,
        msg: '验证码错误',
      };
    }
    return await this.userService.login(accountInfo);
    // throw new HttpException('Forbiden', 403);
  }

  @Post('register')
  async register(@Body() accountInfo: User): Promise<any> {
    return await this.userService.register(accountInfo);
  }

  @Get('authCode')
  async getCode(@Req() req, @Res() res) {
    const svgCaptcha = await this.toolsService.captCha();
    req.session.code = svgCaptcha.text;

    console.log(req.session.code);
    res.type('image/svg+xml');
    res.send(svgCaptcha.data);
  }
}
