import { $Enums } from '@prisma/postgres-client';

/**
 * Interface defining the shape of the data embedded inside the JWT.
 */
export interface ITokenPayload {
  /** The user's email address */
  email: string;
  /** The unique numeric identifier for the user */
  idUser?: number;
  /** The user's role */
  role: $Enums.USER_ROLES;
}
