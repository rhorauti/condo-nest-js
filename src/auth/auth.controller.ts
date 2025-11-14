import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { PostgresAuthService } from './postgres-auth.service';
import { SuccessMessage } from '../common/decorators/response-message.decorator';
import { ErrorMessage } from '../common/decorators/error-message.decorator';
import { LoginDTO } from '../common/dto/auth.dto';
import { LocalAuthGuard } from '../common/guards/local-auth.guard';
import { JwtAuthService } from './jwt-auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly postgresAuthService: PostgresAuthService,
    private readonly jwtAuthService: JwtAuthService,
  ) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @SuccessMessage('Usuário logado com sucesso.')
  @ErrorMessage('Erro ao logar o usuário')
  async getUser(@Request() request) {
    const token = this.jwtAuthService.createToken(request.user);
    return {
      token: token,
      email: request.user.email,
      accessLevel: request.user.accessLevel,
    };
  }

  @Post('signup')
  @SuccessMessage('Usuário criado com sucesso.')
  @ErrorMessage('Erro ao criar o usuário')
  async createUser(@Body() userDTO: LoginDTO) {
    return this.postgresAuthService.createUser(userDTO);
  }
}
