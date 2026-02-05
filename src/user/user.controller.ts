import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { hash } from 'bcrypt';
import type { Request, Response } from 'express';
import { ErrorMessage } from '../core/decorators/error-message.decorator';
import { SuccessMessage } from '../core/decorators/response-message.decorator';
import { EmailService } from '../email/email.service';
import {
  ChangePasswordDTO,
  ChangePasswordResponseDTO,
} from './dto/new-password.dto';
import { SendRecoveryEmailDTO } from './dto/passowrd-recovery.dto';
import { SendEmailSignUpDTO } from './dto/sendEmailSignUp.dto';
import { SignUpDTO, SignUpResponseDTO } from './dto/signup.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthService } from './jwt-auth.service';
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
    if (user) {
      const token = this.jwtAuthService.createToken({
        email: user.email,
        idUser: user.idUser,
      });
      response.cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 2 * 24 * 60 * 60 * 1000,
      });

      return {
        name: user.name,
        email: user.email,
      };
    } else {
      throw new NotFoundException('Email não encontrado.');
    }
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
  async createUser(@Body() userDTO: SignUpDTO): Promise<SignUpResponseDTO> {
    try {
      const user = await this.userService.getUser({
        where: { email: userDTO.email },
      });
      if (user) {
        const hashedPassword = await hash(userDTO.password, 10);
        userDTO.password = hashedPassword;
        const userUpdated = await this.userService.updateUser({
          where: { email: userDTO.email },
          data: userDTO,
        });
        return {
          idUser: userUpdated ? userUpdated.idUser : 0,
          name: userUpdated ? userUpdated.name : '',
          email: userUpdated ? userUpdated.email : '',
          birthDate:
            userUpdated && userUpdated.birthDate
              ? userUpdated.birthDate
              : new Date(0),
          agreedWithTerms: userUpdated ? userUpdated.agreedWithTerms : false,
        };
      } else {
        throw new BadRequestException(
          'O email fornecido não está autorizado a realizar o cadastro.',
        );
      }
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro interno ao criar o usuário.',
      );
    }
  }

  @Post('admin/send-signup-email')
  @SuccessMessage('Email de cadastro enviado com sucesso.')
  @ErrorMessage('Erro ao enviar o e-mail de cadastro.')
  async sendEmailToNewUser(@Body() user: SendEmailSignUpDTO) {
    let step = 'initial';
    try {
      step = 'get-user';
      const existedUser = await this.userService.getUser({
        where: { email: user.email },
      });
      if (existedUser) {
        step = 'user-exists';
        throw new BadRequestException('E-mail já cadastrado.');
      } else {
        step = 'create-user';
        const newUser = await this.userService.createUser(user);
        if (newUser) {
          const token = this.jwtAuthService.createToken({
            email: user.email,
          });
          step = 'send-email';
          await this.emailService.sendSignUpEmail({
            email: user.email,
            name: user.name,
            token: token,
          });
          return { email: user.email, name: user.name };
        }
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (step == 'get-user') {
        throw new BadRequestException('Erro ao verificar se o usuário existe.');
      }
      if (step == 'user-exists') {
        throw new BadRequestException('O e-mail fornecido já existe.');
      }
      if (step == 'create-user') {
        throw new BadRequestException('Erro ao criar o usuário.');
      }
      if (step == 'send-email') {
        throw new InternalServerErrorException(
          'Erro ao enviar o e-mail para cadastro.',
        );
      }
      throw new InternalServerErrorException('Erro interno do servidor.');
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
  ): Promise<ChangePasswordResponseDTO> {
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
        idUser: updatedUser ? updatedUser.idUser : 0,
        name: updatedUser ? updatedUser.name : '',
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
   * Validates a user's email address using a token.
   *
   * @remarks
   * This endpoint is typically hit when a user clicks a link in their verification email.
   * It checks if the email is already confirmed to prevent double-processing.
   *
   * @param req - The request object containing the user's email from the JWT.
   * @returns Partial user data confirming the validation.
   *
   * @throws {NotFoundException} If user is not found.
   * @throws {BadRequestException} If email is already confirmed.
   *
   * @example
   * POST /validate-email (Headers: Authorization: Bearer <verification_token>)
   */
  @Post('validate-email')
  @SuccessMessage('E-mail validado com sucesso!')
  @UseGuards(JwtAuthGuard)
  async ValidateEmail(
    @Req() req: IAuthRequest,
  ): Promise<Partial<SignUpResponseDTO>> {
    const email = req.user.email;
    const url = req.user.url;
    const user = await this.userService.getUser({
      where: { email: email },
    });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    } else {
      if (user.isEmailConfirmed) {
        throw new BadRequestException(
          `O email ${user.email} já foi confirmado anteriormente.`,
        );
      } else {
        const userUpToDate = await this.userService.updateUser({
          where: { email: email },
          data: { isEmailConfirmed: true },
        });
        return {
          idUser: userUpToDate.idUser,
          name: userUpToDate.name,
          email: userUpToDate.email,
        };
      }
    }
  }

  /**
   * Generic token validation endpoint.
   *
   * @remarks
   * Functionally similar to `ValidateEmail`, this endpoint confirms the email
   * associated with the provided JWT token. It updates the `isEmailConfirmed` status.
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
