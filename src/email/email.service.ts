import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import SignUpEmail from './templates/signup.email';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor(private configService: ConfigService) {
    this.resend = new Resend(this.configService.get<string>('RESEND_API_KEY'));
  }

  async sendSignUpEmail({ email, name, token }) {
    console.log('api key', this.configService.get<string>('RESEND_API_KEY'));
    await this.resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Bem vindo a ConectaCondo.',
      react: SignUpEmail({
        name: name,
        url: `${process.env.FRONTEND_URL}/token=${token}`,
      }),
    });
  }
}
