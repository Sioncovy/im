import {
  Body,
  Controller,
  Get,
  Query,
  Post,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { Userinfo, Login, Register } from './user.interface';
import { UserService } from './user.service';
import { ToolsService } from 'src/utils/tools.service';
import { FileService } from '../file/file.service';
import { Public } from 'src/decorators/public.decorator';
import { RedisIntance } from 'src/utils/redis';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { config } from 'src/config';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private toolsService: ToolsService,
    private fileService: FileService,
  ) {}

  @Get('/')
  async getUserByToken(@Req() req: Request) {
    const { username } = req.user as Userinfo;
    return await this.userService.findOne(username, {
      password: 0,
      salt: 0,
      __v: 0,
      _id: 0,
    });
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
    console.log('邮箱验证码', username, rawcode);
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

  @Post('update')
  async updateProfile(@Body() body: any, @Req() req: Request) {
    const { username } = req.user as Userinfo;
    return await this.userService.updateOne(username, body);
  }
}
