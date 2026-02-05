import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import PasswordRecoveryEmail from './templates/password-recovery.email';
import SignUpEmail from './templates/signup.email';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor(private configService: ConfigService) {
    this.resend = new Resend(this.configService.get<string>('RESEND_API_KEY'));
  }

  async sendSignUpEmail({ email, name, token }) {
    await this.resend.emails.send({
      from: this.configService.get<string>('RESEND_FROM_EMAIL') || '',
      to: [email],
      subject: 'Bem vindo a ConectaCondo.',
      react: SignUpEmail({
        name: name,
        url: `${process.env.FRONTEND_URL}/web/signup?email=${email}&name=${name}&token=${token}`,
      }),
    });
  }

  async sendPasswordRecoveryEmail({ email, name, token }) {
    await this.resend.emails.send({
      from: this.configService.get<string>('RESEND_FROM_EMAIL') || '',
      to: [email],
      subject: 'Bem vindo a ConectaCondo.',
      react: PasswordRecoveryEmail({
        name: name,
        url: `${process.env.FRONTEND_URL}/new-password?token=${token}`,
      }),
    });
  }
}
