import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.interface';
import { Model } from 'mongoose';
import { CreateUserDto } from './user.dto';
import { makesalt, encryptPassword } from 'src/utils/cryptogram';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('user') private userModule: Model<User>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async login(accountInfo: User): Promise<any> {
    const { username, password } = accountInfo;
    const userData = await this.userModule.findOne({
      username: accountInfo.username,
    });
    const authResult = await this.authService.validateUser(username, password);
    switch (authResult.code) {
      case 1:
        return await this.authService.certificate(userData);
      case 2:
        return {
          code: 403,
          msg: '账号或密码错误',
        };
      default:
        return {
          code: 404,
          msg: '账号不存在',
        };
    }
  }

  async register(accountInfo: CreateUserDto) {
    const { username, password } = accountInfo;
    if (username.length < 5 || password.length < 6) {
      return {
        code: 444,
        msg: '账号或密码过短',
      };
    }
    const isExist = await this.findOne(username);
    if (isExist) {
      return {
        code: 400,
        msg: '用户已存在',
      };
    }
    // 制作密码盐
    const salt = makesalt();
    const hashPassword = encryptPassword(password, salt);
    try {
      this.userModule.create({
        username,
        password: hashPassword,
        salt,
      });
      return {
        code: 200,
        msg: '注册成功',
      };
    } catch (err) {
      return {
        code: 503,
        msg: `Service Error: ${err}`,
      };
    }
  }

  async findOne(username: string): Promise<User | any> {
    const user = await this.userModule.findOne({ username });
    if (!user) {
      return void 0;
    }
    return user;
  }
}
