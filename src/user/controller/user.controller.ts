import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '@prisma/client';
import { User as SuperbaseUser } from '@supabase/supabase-js';
import { plainToInstance } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';
import { SuperbaseStorageService } from '../../../superbase/superbase-storage.service';
import { SupabaseService } from '../../../superbase/superbase.service';
import { ErrorMessage } from '../../core/decorators/error-message.decorator';
import { SuccessMessage } from '../../core/decorators/response-message.decorator';
import { UpdateUserDTO } from '../dto/update-user.dto';
import { UserService } from '../services/user.service';

interface IAuthRequest {
  user: SuperbaseUser;
  headers: {
    authorization: string;
  };
  csrfToken: () => string;
  body: User;
}

// interface IUserAuth extends Request {
//   idUser?: number;
//   email: string;
// }

export type UploadedFile = {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size?: number;
};

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
    private readonly superbaseService: SupabaseService,
    private readonly superbaseStorageService: SuperbaseStorageService,
  ) {}

  setFallbackName = (name: string): string => {
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length > 1) {
      return (
        parts[0][0].toUpperCase() + parts[parts.length - 1][0].toUpperCase()
      );
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
  @SuccessMessage('Dados do usuário autenticado enviados com sucesso.')
  @ErrorMessage('Erro ao enviar os dados do usuário autenticado.')
  async getAuthUserInfo(@Req() req: IAuthRequest) {
    const idUser = req.user.id;
    const user = await this.userService.getUser({ where: { user_id: idUser } });
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
  @SuccessMessage('Dados do usuário autenticado enviados com sucesso.')
  @ErrorMessage('Erro ao enviar os dados do usuário autenticado.')
  async getDetailedAuthUserInfo(@Req() req: IAuthRequest) {
    const idUser = req.user.id;
    const user = await this.userService.getUser({
      where: { user_id: idUser },
      include: { address: true },
    });
    if (!user) {
      throw new UnauthorizedException('Usuário não autorizado.');
    } else {
      const { idUser, ...rest } = user;
      return rest;
    }
  }

  @Get('profiles/:idUser')
  @SuccessMessage('Dados do usuário autenticado enviados com sucesso.')
  @ErrorMessage('Erro ao enviar os dados do usuário autenticado.')
  async getDetailedUserInfo(@Param('idUser') idUser: number) {
    const user = await this.userService.getUser({
      where: { idUser: idUser },
      include: { address: true },
    });
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado.');
    } else {
      const { idUser, ...rest } = user;
      return rest;
    }
  }

  @Post('profiles')
  @SuccessMessage('Dados do usuário atualizado com sucesso.')
  @ErrorMessage('Erro ao atualizar os dados do usuário.')
  @UseInterceptors(FileInterceptor('file'))
  async SaveUserInfo(
    @Req() req: IAuthRequest,
    @UploadedFile() file?: UploadedFile,
  ) {
    let parsedData: UpdateUserDTO;
    try {
      parsedData = JSON.parse(req.body.data);
    } catch {
      throw new BadRequestException('JSON inválido no campo data.');
    }
    delete parsedData.mediaObject;
    const user_id = req.user.id ?? '';
    const upToDateUser = { ...parsedData, user_id: user_id };
    const dtoInstance = plainToInstance(UpdateUserDTO, parsedData, {
      enableImplicitConversion: true,
    });
    try {
      await validateOrReject(dtoInstance, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });
      let userDataUpdated: User;
      let finalUserUpdate: User & { address?: any };
      userDataUpdated = await this.userService.updateUser({
        where: { user_id: user_id },
        data: upToDateUser,
      });

      const accessToken = req.headers.authorization.split(' ')[1];

      if (!accessToken) {
        throw new UnauthorizedException('Token não encontrado');
      }

      if (file) {
        const fileUploaded = await this.superbaseStorageService.uploadFile(
          accessToken,
          {
            buffer: file.buffer,
            originalName: file.originalname,
            contentType: file.mimetype,
            folder: 'profiles',
          },
        );
        finalUserUpdate = await this.userService.updateUser({
          where: { idUser: userDataUpdated.idUser },
          data: { photoPath: fileUploaded.path },
          include: { address: true },
        });
      }
      return finalUserUpdate;
    } catch (errors) {
      console.error('ERROS DE VALIDAÇÃO:', JSON.stringify(errors, null, 2));
      const messages = (errors as ValidationError[])
        .map((err) => Object.values(err.constraints ?? {}))
        .flat();

      throw new BadRequestException(messages[0]);
    }
  }
}
