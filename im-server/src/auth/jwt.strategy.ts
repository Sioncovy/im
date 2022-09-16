import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
import { UserService } from 'src/server/user/user.service';

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
  async validate(payload: any) {
    const user = await this.userService.findOne(payload.username);
    return { username: user.username };
  }
}
