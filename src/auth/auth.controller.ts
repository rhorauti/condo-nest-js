import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { hash } from 'bcrypt';
import type { Request, Response } from 'express';
import { throwNestError } from '../../utils/misc';
import { ErrorMessage } from '../common/decorators/error-message.decorator';
import { SuccessMessage } from '../common/decorators/response-message.decorator';
import { EmailService } from '../email/email.service';
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
  async getUser(@Req() request: IAuthRequest, @Res() response: Response) {
    try {
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
    } catch (error) {
      throwNestError(error);
    }
  }

  @Post('signup')
  @SuccessMessage('Usuário criado com sucesso.')
  @ErrorMessage('Erro ao criar o usuário')
  async createUser(@Body() userDTO: SignUpDTO): Promise<SignUpResponseDTO> {
    try {
      const hashedPassword = await hash(userDTO.password, 10);
      userDTO.password = hashedPassword;
      const createdUser = await this.postgresAuthService.createUser(userDTO);
      if (createdUser) {
        const token = this.jwtAuthService.createToken(createdUser);
        const emailData = {
          email: createdUser.email,
          name: createdUser.name,
          token: token,
        };
        this.emailService.sendSignUpEmail(emailData);
        return {
          idUser: createdUser.idUser,
          name: createdUser.name,
          email: createdUser.email,
          birthDate: createdUser.birthDate,
          accessLevel: createdUser.accessLevel,
        } as SignUpResponseDTO;
      } else {
        return {
          idUser: 0,
          name: '',
          email: '',
          birthDate: new Date(0),
          accessLevel: 0,
        } as SignUpResponseDTO;
      }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const target = error.meta?.target;
          throw new ConflictException(
            `Registro com campo duplicado: ${target}`,
          );
        }
      }
      throw new InternalServerErrorException('Erro interno do servidor.');
    }
  }

  @Post('token-validation')
  @SuccessMessage('E-mail validado com sucesso!')
  @UseGuards(JwtAuthGuard)
  async ValidateToken(@Req() req: IAuthRequest) {
    const email = req.user.email;
    const user = await this.postgresAuthService.getUser({
      where: { email: email },
    });
    console.log('user 1', user);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    } else {
      if (user.isEmailConfirmed) {
        console.log('user 2', user);
        throw new BadRequestException(
          `O email ${user.email} já foi confirmado anteriormente.`,
        );
      } else {
        const userUpToDate = this.postgresAuthService.updateUser({
          where: { email: email },
          data: { isEmailConfirmed: true },
        });
        return userUpToDate;
      }
    }
  }
}
