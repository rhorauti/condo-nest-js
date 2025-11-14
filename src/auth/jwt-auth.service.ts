import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/postgres-client/client';

@Injectable()
export class JwtAuthService {
  constructor(private jwtService: JwtService) {}

  async createToken(user: User) {
    const payload = {
      email: user.email,
      sub: user.idUser,
      role: user.accessLevel,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      token: accessToken,
    };
  }
}
