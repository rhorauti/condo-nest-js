import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { hash } from 'bcrypt';
import type { Request, Response } from 'express';
import { ErrorMessage } from '../../core/decorators/error-message.decorator';
import { SuccessMessage } from '../../core/decorators/response-message.decorator';
import { EmailService } from '../../email/email.service';
import { ChangePasswordDTO } from '../dto/new-password.dto';
import { SendRecoveryEmailDTO } from '../dto/passowrd-recovery.dto';
import { SignUpDTO } from '../dto/signup.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { JwtAuthService } from '../services/jwt-auth.service';
import { UserService } from '../services/user.service';

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
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtAuthService: JwtAuthService,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Retrieves a CSRF (Cross-Site Request Forgery) token.
   * This token should be included in subsequent state-changing requests (POST, PUT, DELETE)
   * to prevent CSRF attacks.
   *
   * @param request - The Express request object containing the CSRF generator.
   * @returns An object containing the generated CSRF token.
   *
   * @example
   * GET /csrf-token
   * Response: { "csrfToken": "vib71...19s" }
   */
  @Get('csrf-token')
  getCsrfToken(@Req() request: IAuthRequest) {
    return {
      csrfToken: request.csrfToken(),
    };
  }

  setFallbackName = (name: string): string => {
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length > 1) {
      return parts[0][0].toUpperCase() + parts[1][0].toUpperCase();
    }
    return '';
  };

  /**
   * Authenticates a user via email and password (handled by `LocalAuthGuard`).
   * If successful, it generates a JWT, sets it as an HTTP-only cookie, and returns user info.
   *
   * @remarks
   * The `LocalAuthGuard` is expected to validate credentials before this method executes.
   *
   * @param request - Request object containing the user's email in the body.
   * @param response - Express response object used to set the `access_token` cookie.
   * @returns Basic user information (name, email, access level).
   *
   * @throws {NotFoundException} If the user email does not exist in the database.
   *
   * @example
   * POST /login
   * Body: { "email": "user@example.com", "password": "secretPassword" }
   */
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @SuccessMessage('Usuário logado com sucesso.')
  @ErrorMessage('Erro ao logar o usuário')
  async loginUser(
    @Req() request: IAuthRequest,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.userService.getUser({
      where: { email: request.body.email },
    });
    if (!user) {
      throw new BadRequestException('Usuário não encontrado para este e-mail.');
    } else {
      const token = this.jwtAuthService.createToken({
        email: user.email,
        idUser: user.idUser,
        role: user.role,
      });
      response.cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 2 * 24 * 60 * 60 * 1000,
      });

      return {
        email: user.email,
      };
    }
  }

  capitalizeFullName(name: string): string {
    return name
      .toLowerCase()
      .split(' ')
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  /**
   * Registers a new user in the system.
   *
   * @remarks
   * This flow includes:
   * 1. Checking if the email is already in use.
   * 2. Hashing the password (bcrypt).
   * 3. Creating the database record.
   * 4. Sending a welcome/verification email asynchronously.
   *
   * @param userDTO - Data Transfer Object containing registration details.
   * @returns The created user profile.
   *
   * @throws {BadRequestException} If the email is already registered.
   *
   * @example
   * POST /signup
   * Body: { "name": "John", "email": "john@test.com", "password": "123", ... }
   */
  @Post('signup')
  @SuccessMessage('Usuário criado com sucesso.')
  @ErrorMessage('Erro ao criar o usuário')
  async createUser(
    @Body() userDTO: SignUpDTO,
  ): Promise<Omit<SignUpDTO, 'password'> & { idUser: number }> {
    const user = await this.userService.getUser({
      where: { email: userDTO.email },
    });
    if (!user) {
      throw new BadRequestException('Email não autorizado para cadastro.');
    } else {
      const hashedPassword = await hash(userDTO.password, 10);
      const userToBeCreated = {
        ...userDTO,
        password: hashedPassword,
        name: this.capitalizeFullName(userDTO.name),
        isActive: true,
      };
      const userToBeUpdated = await this.userService.updateUser({
        where: { email: userDTO.email },
        data: userToBeCreated,
      });
      return {
        idUser: userToBeUpdated.idUser,
        name: userToBeUpdated.name,
        email: userToBeUpdated.email,
        birthDate: userToBeUpdated.birthDate
          ? userToBeUpdated.birthDate
          : new Date(),
        agreedWithTerms: userToBeUpdated.agreedWithTerms,
      };
    }
  }

  /**
   * Updates the password for an authenticated user.
   *
   * @remarks
   * Requires a valid JWT token. It hashes the new password before saving.
   *
   * @param req - The request object containing the authenticated user's email.
   * @param userDTO - DTO containing the new password.
   * @returns A partial user object confirming the update.
   *
   * @throws {BadRequestException} If the user email from the token is not found in DB.
   *
   * @example
   * POST /new-password (Headers: Authorization: Bearer <token>)
   * Body: { "password": "newSecurePassword123!" }
   */
  @Post('new-password')
  @SuccessMessage('Senha atualizada com sucesso.')
  @ErrorMessage('Erro ao atualizar a senha')
  @UseGuards(JwtAuthGuard)
  async updatePassword(
    @Req() req: IAuthRequest,
    @Body() userDTO: ChangePasswordDTO,
  ) {
    const email = req.user.email;
    const user = await this.userService.getUser({
      where: { email: email },
    });
    if (!user) {
      throw new BadRequestException('E-mail do usuário não encontrado.');
    } else {
      const hashedPassword = await hash(userDTO.password, 10);
      userDTO.password = hashedPassword;
      const updatedUser = await this.userService.updateUser({
        where: { email: email },
        data: userDTO,
      });
      return {
        email: updatedUser ? updatedUser.email : '',
      };
    }
  }

  /**
   * Initiates the password recovery process.
   *
   * @remarks
   * If the email exists, it generates a recovery token and sends an email with instructions.
   * It handles the email sending asynchronously to not block the response.
   *
   * @param userDTO - DTO containing the email address to recover.
   * @returns The email address processed.
   *
   * @throws {BadRequestException} If the email is not found in the database.
   *
   * @example
   * POST /password-recovery
   * Body: { "email": "forgot@example.com" }
   */
  @Post('password-recovery')
  @SuccessMessage('E-mail enviado com sucesso.')
  @ErrorMessage('Erro ao enviar o e-mail. Tente novamente mais tarde.')
  async sendRecoveryEmail(
    @Body() userDTO: SendRecoveryEmailDTO,
  ): Promise<SendRecoveryEmailDTO> {
    const user = await this.userService.getUser({
      where: { email: userDTO.email },
    });
    if (!user) {
      throw new BadRequestException(
        'Não existe registro do e-mail fornecido no nosso banco de dados.',
      );
    } else {
      const token = this.jwtAuthService.createToken({
        idUser: user.idUser,
        email: user.email,
        role: user.role,
      });
      const emailData = {
        name: user.name,
        email: user.email,
        token: token,
      };
      this.emailService.sendPasswordRecoveryEmail(emailData).catch((error) => {
        console.error(
          `❌ Falha ao enviar e-mail de recuperação para: ${user.email}`,
          error,
        );
      });

      return {
        email: user.email,
      };
    }
  }

  /**
   * Generic token validation endpoint.
   *
   *
   * @param req - The request object containing the user's email from the JWT.
   * @returns Partial user data.
   *
   * @throws {NotFoundException} If user is not found.
   *
   * @example
   * POST /token-validation (Headers: Authorization: Bearer <token>)
   */
  @Post('token-validation')
  @SuccessMessage('Token validado com sucesso!')
  @UseGuards(JwtAuthGuard)
  async ValidateToken(@Req() req: IAuthRequest): Promise<void> {
    const email = req.user.email;
    const user = await this.userService.getUser({
      where: { email: email },
    });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }
  }
}
