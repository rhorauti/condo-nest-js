// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { JwtService } from '@nestjs/jwt';
// import { ITokenPayload } from '../../core/interfaces/jwt.interface';

// /**
//  * **JwtAuthService**
//  *
//  * Service responsible for managing JSON Web Tokens (JWT).
//  * It handles the cryptographic signing of tokens using the application's
//  * secret key and configuration settings.
//  */
// @Injectable()
// export class JwtAuthService {
//   constructor(
//     private readonly jwtService: JwtService,
//     private readonly configService: ConfigService,
//   ) {}

//   /**
//    * Generates a signed JWT access token for a specific user.
//    *
//    * @remarks
//    * The token is signed using the `JWT_SECRET_KEY` retrieved from the `ConfigService`.
//    * The default expiration time is hardcoded to **2 days** (`2d`).
//    *
//    * @param user - The payload object containing essential user identification data.
//    * @returns A string representing the encoded and signed JWT.
//    *
//    * @example
//    * const token = service.createToken({
//    * email: 'jane@example.com',
//    * idUser: 55,
//    * accessLevel: 1
//    * });
//    * // Returns: "eyJhbGciOiJIUzI1NiIsInR5cCI..."
//    */
//   createToken(user: ITokenPayload): string {
//     const payload = {
//       email: user.email,
//       idUser: user.idUser,
//       role: user.role,
//     };

//     return this.jwtService.sign(payload, {
//       secret: this.configService.get<string>('JWT_SECRET_KEY'),
//       expiresIn: '2d',
//     });
//   }
// }
