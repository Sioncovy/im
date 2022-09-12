import { Controller, Get, Post } from '@nestjs/common';
// import { HttpException } from '@nestjs/common/exceptions';
import { User } from './user.interface';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('all')
  async AllUsers(): Promise<User[]> {
    return await this.userService.getAllUsers();
    // throw new HttpException('Forbiden', 403);
  }
}
