import { Controller, Get, Query } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get('test')
  async sendTestEmail(
    @Query('to') to: string,
    @Query('subject') subject: string,
    @Query('text') text: string,
  ) {
    return this.emailService.sendEmail(
      to || 'test@example.com',
      subject || 'Test Email',
      text || 'This is a test email sent from NestJS using Gmail!',
    );
  }
}
