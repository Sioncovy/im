import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from '../config';
import { UserService } from 'src/server/user/user.service';
import { Userinfo } from 'src/server/user/user.interface';

@Injectable()
export class jwtStategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  // 配置token记录的信息，解析后也是这个，不能直接解构user，会有大量内部结构的信息
  async validate(payload: any): Promise<Userinfo> {
    const user = await this.userService.findOne(payload.username);
    return { username: user.username };
  }
}
