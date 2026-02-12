import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import type { Request, Response } from 'express';
import { SupabaseService } from '../../../superbase/superbase.service';
import { ErrorMessage } from '../../core/decorators/error-message.decorator';
import { SuccessMessage } from '../../core/decorators/response-message.decorator';
import { USER_ROLES } from '../../core/enum/role.enum';
import { EmailService } from '../../email/email.service';
import { Public } from '../decorator/public.decorator';
import { SendRecoveryEmailDTO } from '../dto/passowrd-recovery.dto';
import { SendEmailSignUpDTO } from '../dto/send-email-signup.dto';
import { SignUpDTO } from '../dto/signup.dto';
// import { JwtAuthService } from '../services/jwt-auth.service';
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
    // private readonly jwtAuthService: JwtAuthService,
    private readonly supabaseService: SupabaseService,
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
  @Public()
  @Get('auth/csrf-token')
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

  generateSecureTempPassword(length = 10): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*';
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    let password = '';

    for (let i = 0; i < length; i++) {
      const index = array[i] % chars.length;
      password += chars[index];
    }

    return password;
  }

  @Public()
  @Post('auth/send-signup-email')
  // @Roles(USER_ROLES.ADMIN, USER_ROLES.ADMIN_ROOT)
  @SuccessMessage('Email de cadastro enviado com sucesso.')
  @ErrorMessage('Erro ao enviar o e-mail de cadastro.')
  async sendEmailToNewUser(@Body() dto: SendEmailSignUpDTO) {
    const existedUser = await this.userService.getUser({
      where: { email: dto.email },
    });

    if (existedUser) {
      throw new BadRequestException('E-mail já cadastrado.');
    }

    const supabase = this.supabaseService.getAdminClient();

    const { data, error } = await supabase.auth.admin.inviteUserByEmail(
      dto.email,
      {
        redirectTo: `${process.env.FRONTEND_URL}/signup`,
        data: {
          role: dto.role ?? USER_ROLES.USER,
          name: this.capitalizeFullName(dto.name),
        },
      },
    );

    if (error) {
      throw new InternalServerErrorException(
        error.message ?? 'Erro ao enviar o e-mail de cadastro',
      );
    }

    return {
      email: dto.email,
      name: dto.name,
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
  @Public()
  @Post('auth/email')
  @SuccessMessage('Usuário logado com sucesso.')
  @ErrorMessage('Erro ao logar o usuário')
  async loginUser(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) response: Response,
  ) {
    const { email, password } = body;

    const supabase = this.supabaseService.getAdminClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const accessToken = data.session.access_token;

    response.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: data.session.expires_in * 1000,
    });

    return {
      email: data.user.email,
    };
  }

  @Public()
  @Get('auth/google')
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const code = req.query.code as string;

    const supabase = this.supabaseService.getAdminClient();

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error || !data.session) {
      throw new UnauthorizedException('Falha no login Google');
    }

    res.cookie('access_token', data.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: data.session.expires_in * 1000,
    });

    return res.redirect(process.env.FRONTEND_URL + '/web' || '');
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

  @Post('auth/signup')
  @SuccessMessage('Usuário criado com sucesso. Verifique seu e-mail.')
  @ErrorMessage('Erro ao criar o usuário')
  async createUser(
    @Req() req: any,
    @Body() userDTO: SignUpDTO,
  ): Promise<Omit<SignUpDTO, 'password'>> {
    try {
      const user = req.user;
      if (user) {
        const createdUser = await this.userService.createUser({
          name: this.capitalizeFullName(user.user_metadata.name),
          user_id: user.id,
          email: user.email ?? '',
          role: user.user_metadata.role,
          birthDate: userDTO.birthDate,
          agreedWithTerms: userDTO.agreedWithTerms,
          isActive: true,
        });

        return {
          name: createdUser.name,
          email: createdUser.email,
          birthDate: new Date(createdUser.birthDate ?? ''),
          agreedWithTerms: createdUser.agreedWithTerms,
          role: createdUser.role as USER_ROLES,
        };
      } else {
        throw new BadRequestException('user_id inválido.');
      }
    } catch (error) {
      throw error;
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
  @Public()
  @Post('auth/new-password')
  @SuccessMessage('Senha atualizada com sucesso.')
  @ErrorMessage('Erro ao atualizar a senha')
  async updatePassword(@Req() req: any, @Body() body: { password: string }) {
    const supabase = this.supabaseService.getUserClient(
      req.cookies.access_token,
    );

    const { error } = await supabase.auth.updateUser({
      password: body.password,
    });

    if (error) {
      throw new BadRequestException(error.message);
    }

    return {
      message: 'Senha atualizada com sucesso',
    };
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
  @Public()
  @Post('auth/password-recovery')
  @SuccessMessage('E-mail enviado com sucesso.')
  @ErrorMessage('Erro ao enviar o e-mail. Tente novamente mais tarde.')
  async sendRecoveryEmail(
    @Body() body: SendRecoveryEmailDTO,
  ): Promise<{ email: string }> {
    const user = await this.userService.getUser({
      where: { email: body.email },
    });

    if (!user) {
      throw new BadRequestException(
        'Não existe registro do e-mail fornecido no nosso banco de dados.',
      );
    }

    const supabase = this.supabaseService.getAdminClient();

    const { error } = await supabase.auth.resetPasswordForEmail(body.email, {
      redirectTo: `${process.env.FRONTEND_URL}/auth/reset-password`,
    });

    if (error) {
      throw new BadRequestException(error.message);
    }

    return {
      email: body.email,
    };
  }
}
