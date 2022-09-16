import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { UserService } from 'src/server/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { encryptPassword } from 'src/utils/cryptogram';
import { RedisIntance } from 'src/utils/redis';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UserService))
    private readonly usersService: UserService,
  ) {}

  // 校验用户信息
  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user) {
      const hashedPassword = user.password;
      const salt = user.salt;
      // 通过密码盐，加密传参，再与数据库里的比较，判断是否相等
      const hashPassword = encryptPassword(password, salt);
      if (hashedPassword === hashPassword) {
        // 密码正确
        return {
          code: 1,
          user,
        };
      } else {
        // 密码错误
        return {
          code: 2,
          user: null,
        };
      }
    }
    // 账号不存在
    return {
      code: 3,
      user: null,
    };
  }

  // 处理 JWT 签证
  async certificate(user: any) {
    const payload = { username: user.username, password: user.password };
    try {
      const token = this.jwtService.sign(payload);
      // 实例化 redis
      const redis = await RedisIntance.initRedis('auth.certificate', 0);
      // 将用户信息和 token 存入 redis，并设置失效时间，语法：[key, seconds, value]
      await redis.setex(`${user.username}`, 300, `${token}`);
      return {
        code: 200,
        data: {
          token,
        },
        msg: '登录成功 ',
      };
    } catch (err) {
      return {
        code: 403,
        data: null,
        msg: '账号或密码错误',
      };
    }
  }
}
