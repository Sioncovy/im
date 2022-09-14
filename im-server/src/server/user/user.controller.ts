import { Body, Controller, Get, Post } from '@nestjs/common';
// import { HttpException } from '@nestjs/common/exceptions';
import { User } from './user.interface';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('login')
  async login(@Body() accountInfo: User): Promise<string> {
    // console.log(accountInfo);
    return await this.userService.login(accountInfo);
    // throw new HttpException('Forbiden', 403);
  }

  @Post('register')
  async register(@Body() accountInfo: User): Promise<any> {
    return await this.userService.register(accountInfo);
  }
}
