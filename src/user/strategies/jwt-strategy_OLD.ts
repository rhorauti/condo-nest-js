// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { ITokenPayload } from '../../core/interfaces/jwt.interface';

// const cookieExtractor = (req: any): string | null => {
//   if (req && req.cookies) {
//     return req.cookies['access_token'];
//   }
//   return null;
// };

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
//   constructor(private configService: ConfigService) {
//     const secret = configService.get<string>('JWT_SECRET_KEY');

//     if (!secret) {
//       throw new UnauthorizedException(
//         'JWT_SECRET_KEY is not set in environment variables!',
//       );
//     }

//     super({
//       jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
//       secretOrKey: secret,
//     });
//   }

//   validate(payload: ITokenPayload) {
//     return { idUser: payload.idUser, email: payload.email, role: payload.role };
//   }
// }
