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
import { ErrorMessage } from '../common/decorators/error-message.decorator';
import { SuccessMessage } from '../common/decorators/response-message.decorator';
import { EmailService } from '../email/email.service';
import { NewPasswordDTO, NewPasswordResponseDTO } from './dto/new-password.dto';
import { PasswordRecoveryDTO } from './dto/passowrd-recovery.dto';
import { SignUpDTO, SignUpResponseDTO } from './dto/signup.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthService } from './jwt-auth.service';
import { PostgresAuthService } from './postgres-auth.service';

interface IAuthRequest {
  user: IUserAuth;
  csrfToken: () => string;
  body: User;
}

interface IUserAuth extends Request {
  idUser?: number;
  email: string;
  accessLevel?: number;
}

@Controller()
export class AuthController {
  constructor(
    private readonly postgresAuthService: PostgresAuthService,
    private readonly jwtAuthService: JwtAuthService,
    private readonly emailService: EmailService,
  ) {}

  @Get('csrf-token')
  getCsrfToken(@Req() request: IAuthRequest) {
    return {
      csrfToken: request.csrfToken(),
    };
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @SuccessMessage('Usuário logado com sucesso.')
  @ErrorMessage('Erro ao logar o usuário')
  async loginUser(
    @Req() request: IAuthRequest,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.postgresAuthService.getUser({
      where: { email: request.body.email },
    });
    if (user) {
      const token = this.jwtAuthService.createToken({
        email: user.email,
        idUser: user.idUser,
        accessLevel: user.accessLevel,
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
        accessLevel: user.accessLevel,
      };
    } else {
      throw new NotFoundException('Email não encontrado.');
    }
  }

  @Post('signup')
  @SuccessMessage('Usuário criado com sucesso.')
  @ErrorMessage('Erro ao criar o usuário')
  async createUser(@Body() userDTO: SignUpDTO): Promise<SignUpResponseDTO> {
    const user = await this.postgresAuthService.getUser({
      where: { email: userDTO.email },
    });
    if (user) {
      throw new BadRequestException('O e-mail fornecido já existe.');
    } else {
      const hashedPassword = await hash(userDTO.password, 10);
      userDTO.password = hashedPassword;
      const createdUser = await this.postgresAuthService.createUser(userDTO);
      if (createdUser) {
        const token = this.jwtAuthService.createToken({
          idUser: createdUser.idUser,
          email: createdUser.email,
          accessLevel: createdUser.accessLevel,
        });
        const emailData = {
          email: createdUser.email,
          name: createdUser.name,
          token: token,
        };

        this.emailService.sendSignUpEmail(emailData).catch((error) => {
          console.error(
            `❌ Falha ao enviar e-mail para : ${createdUser.email}`,
            error,
          );
        });
      }
      return {
        idUser: createdUser ? createdUser.idUser : 0,
        name: createdUser ? createdUser.name : '',
        email: createdUser ? createdUser.email : '',
        birthDate:
          createdUser && createdUser.birthDate
            ? createdUser.birthDate
            : new Date(0),
        accessLevel: createdUser ? createdUser.accessLevel : 0,
        agreedWithTerms: createdUser ? createdUser.agreedWithTerms : false,
      };
    }
  }

  @Post('new-password')
  @SuccessMessage('Senha atualizada com sucesso.')
  @ErrorMessage('Erro ao atualizar a senha')
  @UseGuards(JwtAuthGuard)
  async updatePassword(
    @Req() req: IAuthRequest,
    @Body() userDTO: NewPasswordDTO,
  ): Promise<NewPasswordResponseDTO> {
    const email = req.user.email;
    const user = await this.postgresAuthService.getUser({
      where: { email: email },
    });
    if (!user) {
      throw new BadRequestException('E-mail do usuário não encontrado.');
    } else {
      const hashedPassword = await hash(userDTO.password, 10);
      userDTO.password = hashedPassword;
      const updatedUser = await this.postgresAuthService.updateUser({
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

  @Post('password-recovery')
  @SuccessMessage('E-mail enviado com sucesso.')
  @ErrorMessage('Erro ao enviar o e-mail. Tente novamente mais tarde.')
  async sendRecoveryEmail(
    @Body() userDTO: PasswordRecoveryDTO,
  ): Promise<PasswordRecoveryDTO> {
    const user = await this.postgresAuthService.getUser({
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
        accessLevel: user.accessLevel,
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

  @Post('validate-email')
  @SuccessMessage('E-mail validado com sucesso!')
  @UseGuards(JwtAuthGuard)
  async ValidateEmail(
    @Req() req: IAuthRequest,
  ): Promise<Partial<SignUpResponseDTO>> {
    const email = req.user.email;
    const url = req.user.url;
    const user = await this.postgresAuthService.getUser({
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
        const userUpToDate = await this.postgresAuthService.updateUser({
          where: { email: email },
          data: { isEmailConfirmed: true },
        });
        return {
          idUser: userUpToDate.idUser,
          name: userUpToDate.name,
          email: userUpToDate.email,
          accessLevel: userUpToDate.accessLevel,
        };
      }
    }
  }

  @Post('token-validation')
  @SuccessMessage('E-mail validado com sucesso!')
  @UseGuards(JwtAuthGuard)
  async ValidateToken(
    @Req() req: IAuthRequest,
  ): Promise<Partial<SignUpResponseDTO>> {
    const email = req.user.email;
    const url = req.user.url;
    const user = await this.postgresAuthService.getUser({
      where: { email: email },
    });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    } else {
      const userUpToDate = await this.postgresAuthService.updateUser({
        where: { email: email },
        data: { isEmailConfirmed: true },
      });
      return {
        idUser: userUpToDate.idUser,
        name: userUpToDate.name,
        email: userUpToDate.email,
        accessLevel: userUpToDate.accessLevel,
      };
    }
  }
}
