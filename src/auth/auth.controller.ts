import {
  Body,
  ConflictException,
  Controller,
  InternalServerErrorException,
  Logger,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { hash } from 'bcrypt';
import { ErrorMessage } from '../common/decorators/error-message.decorator';
import { SuccessMessage } from '../common/decorators/response-message.decorator';
import { EmailService } from '../email/email.service';
import { SignUpDTO } from './dto/signup.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthService } from './jwt-auth.service';
import { PostgresAuthService } from './postgres-auth.service';

@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly postgresAuthService: PostgresAuthService,
    private readonly jwtAuthService: JwtAuthService,
    private readonly emailService: EmailService,
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
  async createUser(@Body() userDTO: SignUpDTO) {
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
        
        this.logger.log(`📧 Attempting to send welcome email to: ${createdUser.email}`);
        
        try {
          await this.emailService.sendSignUpEmail(emailData);
          this.logger.log(`✅ Welcome email sent successfully to: ${createdUser.email}`);
        } catch (emailError) {
          this.logger.error(`❌ Failed to send welcome email to: ${createdUser.email}`, emailError);
          // Continue with user creation even if email fails
        }
        
        return createdUser;
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
}
