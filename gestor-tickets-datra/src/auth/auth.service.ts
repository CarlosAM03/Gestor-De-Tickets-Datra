import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { DomainError } from '../common/errors/domain.error';
import { AppLogger } from '../common/logger/app.logger';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  // ==========================
  // Validar credenciales
  // ==========================
  private async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      AppLogger.error('Login fallido - usuario inexistente', { email });
      throw new DomainError('Credenciales inválidas', 'UNAUTHORIZED');
    }

    if (!user.active) {
      AppLogger.error('Login bloqueado - usuario inactivo', { email });
      throw new DomainError('Usuario inactivo', 'FORBIDDEN');
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      AppLogger.error('Login fallido - password incorrecto', { email });
      throw new DomainError('Credenciales inválidas', 'UNAUTHORIZED');
    }

    return user;
  }

  // ==========================
  // Login
  // ==========================
  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwt.signAsync(payload);

    AppLogger.log('Login exitoso', { userId: user.id });
    return {
      message: 'Login exitoso',
      access_token: accessToken,
      expires_in: this.config.get<string>('JWT_EXPIRES') ?? '3600s',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
