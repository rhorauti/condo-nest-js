import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Req,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '@prisma/client';
import { Prisma, USER_ROLES } from '@prisma/postgres-client/client';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import type { Request } from 'express';
import { ErrorMessage } from '../../core/decorators/error-message.decorator';
import { SuccessMessage } from '../../core/decorators/response-message.decorator';
import { EmailService } from '../../email/email.service';
import { Roles } from '../decorator/roles.decorator';
import { SendEmailSignUpDTO } from '../dto/send-email-signup.dto';
import { UpdateUserDTO } from '../dto/update-user.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
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
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtAuthService: JwtAuthService,
    private readonly emailService: EmailService,
  ) {}

  setFallbackName = (name: string): string => {
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length > 1) {
      return parts[0][0].toUpperCase() + parts[1][0].toUpperCase();
    }
    return '';
  };

  capitalizeFullName(name: string): string {
    return name
      .toLowerCase()
      .split(' ')
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  @Get('profiles/me')
  @UseGuards(JwtAuthGuard)
  @SuccessMessage('Dados do usuário autenticado enviados com sucesso.')
  @ErrorMessage('Erro ao enviar os dados do usuário autenticado.')
  async getAuthUserInfo(@Req() req: IAuthRequest) {
    const idUser = req.user.idUser;
    const user = await this.userService.getUser({ where: { idUser: idUser } });
    if (!user) {
      throw new UnauthorizedException('Usuário não autorizado.');
    } else {
      return {
        idUser: user.idUser,
        email: user.email,
        name: user.name,
        photoUrl: user.photoPath,
        fallbackName: this.setFallbackName(user.name),
      };
    }
  }

  @Get('profiles/me/detail')
  @UseGuards(JwtAuthGuard)
  @SuccessMessage('Dados do usuário autenticado enviados com sucesso.')
  @ErrorMessage('Erro ao enviar os dados do usuário autenticado.')
  async getDetailedAuthUserInfo(@Req() req: IAuthRequest) {
    const idUser = req.user.idUser;
    const user = await this.userService.getUser({
      where: { idUser: idUser },
      include: { address: true },
    });
    if (!user) {
      throw new UnauthorizedException('Usuário não autorizado.');
    } else {
      const { password, ...rest } = user;
      return rest;
    }
  }

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

  @Post('send-signup-email')
  @Roles(USER_ROLES.ADMIN, USER_ROLES.ADMIN_ROOT)
  @SuccessMessage('Email de cadastro enviado com sucesso.')
  @ErrorMessage('Erro ao enviar o e-mail de cadastro.')
  async sendEmailToNewUser(@Body() user: SendEmailSignUpDTO) {
    const existedUser = await this.userService.getUser({
      where: { email: user.email },
    });
    if (existedUser) {
      throw new BadRequestException('E-mail já cadastrado.');
    } else {
      let newUser;
      const userToBeCreated: Prisma.UserCreateInput = {
        ...user,
        name: this.capitalizeFullName(user.name),
        password: this.generateSecureTempPassword(),
      };
      try {
        newUser = await this.userService.createUser(userToBeCreated);
      } catch (error) {
        throw new InternalServerErrorException('Erro ao criar o usuário.');
      }
      if (newUser) {
        const token = this.jwtAuthService.createToken({
          email: user.email,
          role: user.role,
        });
        try {
          await this.emailService.sendSignUpEmail({
            email: user.email,
            name: user.name,
            token: token,
          });
        } catch (error) {
          throw new InternalServerErrorException(
            'Erro ao enviar o e-mail de cadastro.',
          );
        }
        return { email: user.email, name: user.name };
      }
    }
  }

  @Post('profiles')
  @UseInterceptors(FileInterceptor('file'))
  async SaveUserInfo(@Body() body: any, @UploadedFile() file?: any) {
    let parsedData: UpdateUserDTO;

    try {
      console.log('body', body.data);
      parsedData = JSON.parse(body.data);
    } catch {
      throw new BadRequestException('JSON inválido no campo data.');
    }

    // 2️⃣ Converte para DTO real
    const dtoInstance = plainToInstance(UpdateUserDTO, parsedData);

    // 3️⃣ Validação manual
    await validateOrReject(dtoInstance, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    console.log('DTO VALIDADO:', dtoInstance);
    console.log('FILE:', file);

    return;
  }
}
