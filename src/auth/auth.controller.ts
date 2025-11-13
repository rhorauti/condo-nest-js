import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  async getUsers() {
    return this.authService.getUsers();
  }

  @Get('mongo')
  async getUsersMongo() {
    return this.authService.getUsersMongo();
  }
}
