import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import type { User } from '@prisma/client';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService,
    private config: ConfigService,
  ) {
    // Construimos las opciones con un secret garantizado (string)
    const secret = config.get<string>('JWT_SECRET') ?? '';
    const opts: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    };

    super(opts);
  }

  // payload tipado con las propiedades que generamos en login
  async validate(payload: {
    sub: number;
    email?: string;
    role?: string;
  }): Promise<Omit<User, 'password'> | null> {
    const user = await this.userService.findOne(payload.sub);

    if (!user) {
      throw new UnauthorizedException('Token inválido o usuario no existe');
    }

    return user; // user ya sin password por cómo definimos findOne
  }
}
