import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { compare } from 'bcrypt';
import { Strategy } from 'passport-local';
import { PostgresAuthService } from '../postgres-auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: PostgresAuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.getUser({
      where: { email: email },
    });

    if (user) {
      const isPasswordOk = await compare(password, user?.password || '');

      if (isPasswordOk) {
        const { password, ...result } = user;
        return result;
      } else {
        throw new UnauthorizedException('Senha inválida.');
      }
    } else {
      throw new UnauthorizedException('Email inválido.');
    }
  }
}
