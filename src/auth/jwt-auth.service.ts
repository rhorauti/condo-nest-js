import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

interface ITokenPayload {
  email: string;
  idUser: number;
  accessLevel: number;
}

@Injectable()
export class JwtAuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  createToken(user: ITokenPayload): string {
    const payload = {
      email: user.email,
      idUser: user.idUser,
      accessLevel: user.accessLevel,
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET_KEY'),
      expiresIn: '2d',
    });
  }
}
