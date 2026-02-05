import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

/**
 * Interface defining the shape of the data embedded inside the JWT.
 */
interface ITokenPayload {
  /** The user's email address */
  email: string;
  /** The unique numeric identifier for the user */
  idUser?: number;
}

/**
 * **JwtAuthService**
 *
 * Service responsible for managing JSON Web Tokens (JWT).
 * It handles the cryptographic signing of tokens using the application's
 * secret key and configuration settings.
 */
@Injectable()
export class JwtAuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Generates a signed JWT access token for a specific user.
   *
   * @remarks
   * The token is signed using the `JWT_SECRET_KEY` retrieved from the `ConfigService`.
   * The default expiration time is hardcoded to **2 days** (`2d`).
   *
   * @param user - The payload object containing essential user identification data.
   * @returns A string representing the encoded and signed JWT.
   *
   * @example
   * const token = service.createToken({
   * email: 'jane@example.com',
   * idUser: 55,
   * accessLevel: 1
   * });
   * // Returns: "eyJhbGciOiJIUzI1NiIsInR5cCI..."
   */
  createToken(user: ITokenPayload): string {
    const payload = {
      email: user.email,
      idUser: user.idUser,
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET_KEY'),
      expiresIn: '2d',
    });
  }
}
