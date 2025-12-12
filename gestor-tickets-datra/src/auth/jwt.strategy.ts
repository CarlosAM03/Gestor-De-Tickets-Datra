import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'SECRET_DATRATICKETS', // mover a .env luego
    });
  }

  async validate(payload: { sub: number }) {
    const user = await this.userService.findOne(payload.sub);
    if (!user) throw new UnauthorizedException('Token inválido');

    return user; // se adjunta a req.user
  }
}
