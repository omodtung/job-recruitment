import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUser } from '@/users/users.interface';
import { StatelessService } from '../stateless.service';
import { Console } from 'console';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  //https://stackoverflow.com/a/50983040
  constructor(
    protected configService: ConfigService,
    private authService: StatelessService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
    });
  }

  // async validate(payload: any) {
  //   return { _id: payload.sub, username: payload.username, name: payload.name };
  // }

  //   update decode Token Giai ma token
  async validate(payload: IUser) {
    const { _id, name, email, role } = payload;

    const user = await this.authService.findUser(_id);

    if (!user) {
      throw new UnauthorizedException('Invalid TOken!');
    }

    // gan vao req.user
    // return user;
    return {
      _id,
      name,
      email,
      role,
    };
  }
}
