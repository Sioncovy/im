import { Body, Session, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { User, Login } from './user.interface';
import { UserService } from './user.service';
import { ToolsService } from 'src/utils/tools.service';
import { Public } from 'src/decorators/public.decorator';
import { RedisIntance } from 'src/utils/redis';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private toolsService: ToolsService,
  ) {}

  // @UseGuards(JwtAuthGuard)
  @Get('/')
  async getUserByToken(@Req() req) {
    console.log(req);
    return req.user;
  }

  @Public()
  @Post('login')
  async login(@Body() accountInfo: Login, @Session() session): Promise<any> {
    const redis = await RedisIntance.initRedis('user.authCode', 0);

    const code = accountInfo.code.toLowerCase();
    const rawcode = (await redis.get('authCode')).toLowerCase();

    console.log('--', rawcode, code);
    if (rawcode !== code) {
      return {
        code: 403,
        msg: '验证码错误',
      };
    }
    return await this.userService.login(accountInfo);
    // throw new HttpException('Forbiden', 403);
  }

  @Public()
  @Post('register')
  async register(@Body() accountInfo: User): Promise<any> {
    return await this.userService.register(accountInfo);
  }

  @Public()
  @Get('authCode')
  async getCode(@Req() req, @Res() res) {
    const svgCaptcha = await this.toolsService.captCha();
    const redis = await RedisIntance.initRedis('user.authCode', 0);
    await redis.setex('authCode', 60 * 30, svgCaptcha.text);
    // console.log(req.session.code);
    res.type('image/svg+xml');
    res.send(svgCaptcha.data);
  }
}
