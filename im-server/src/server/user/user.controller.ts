import { Body, Controller, Get, Query, Post, Req, Res } from '@nestjs/common';
import { User, Login, Register } from './user.interface';
import { UserService } from './user.service';
import { ToolsService } from 'src/utils/tools.service';
import { Public } from 'src/decorators/public.decorator';
import { RedisIntance } from 'src/utils/redis';
import { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private toolsService: ToolsService,
  ) {}

  @Get('/')
  async getUserByToken(@Req() req: Request) {
    return req.user;
  }

  @Public()
  @Post('login')
  async login(@Body() body: Login): Promise<any> {
    const redis = await RedisIntance.initRedis('user.login', 0);
    const { code, timestamp } = body;

    const lcode = code?.toLowerCase();
    const rawcode = (await redis.get(`authCode-${timestamp}`))?.toLowerCase();

    if (rawcode !== lcode) {
      return {
        code: 403,
        msg: '验证码错误',
      };
    }
    return await this.userService.login(body);
    // throw new HttpException('Forbiden', 403);
  }

  @Public()
  @Post('register')
  async register(@Body() body: Register): Promise<any> {
    const { username, password, code } = body;
    const redis = await RedisIntance.initRedis('user.register', 0);
    const rawcode = await redis.get(`emailCode-${username}`);
    if (
      username.length < 6 ||
      password.length < 6 ||
      code?.toLowerCase() !== rawcode?.toLowerCase()
    )
      return;
    const user = await this.userService.findOne(username);
    if (user) {
      return {
        code: 444,
        msg: '该邮箱已被注册！',
      };
    }
    return await this.userService.register(body);
  }

  @Public()
  @Get('authCode')
  async getCode(@Query() query) {
    const { timestamp } = query;

    const svgCaptcha = await this.toolsService.captCha();

    const redis = await RedisIntance.initRedis('user.authCode', 0);
    await redis.setex(`authCode-${timestamp}`, 60 * 3, svgCaptcha.text);

    return svgCaptcha.data;
  }

  @Get('query')
  async queryUsers(@Query() query: { username: string }) {
    const { username } = query;

    return await this.userService.findAll(username);
  }
}
