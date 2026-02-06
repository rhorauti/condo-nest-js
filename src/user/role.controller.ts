import { Body, Controller, Post } from '@nestjs/common';
import { User } from '@prisma/client';
import type { Request } from 'express';
import { ErrorMessage } from '../core/decorators/error-message.decorator';
import { SuccessMessage } from '../core/decorators/response-message.decorator';
import { JwtAuthService } from './jwt-auth.service';
import { RoleService } from './role.service';
import { UserService } from './user.service';

interface IAuthRequest {
  user: IUserAuth;
  csrfToken: () => string;
  body: User;
}

interface IUserAuth extends Request {
  idUser?: number;
  email: string;
}

/**
 * **AuthController**
 *
 * Handles all HTTP requests related to user authentication and authorization.
 * It manages the flow between HTTP inputs, the PostgreSQL database service,
 * JWT generation, and Email notifications.
 */
@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtAuthService: JwtAuthService,
    private readonly roleService: RoleService,
  ) {}

  @Post('roles')
  @SuccessMessage('Role criada com sucesso.')
  @ErrorMessage('Erro ao criar a role')
  async loginUser(
    @Body()
    roleToBeAdded: {
      idRole: number;
      name: string;
      description: string;
      user: User;
    },
  ) {
    const role = await this.roleService.createRole(roleToBeAdded);

    return {
      idRole: role.idRole,
      name: role.name,
      description: role.decription,
    };
  }
}
