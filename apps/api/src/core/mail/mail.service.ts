import { mailConfig } from '../../config/mail.config.js';
import { logger } from '../utils/logger.js';

export interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface IMailService {
  sendMail(options: SendMailOptions): Promise<boolean>;
}

export class MailService implements IMailService {
  public async sendMail(options: SendMailOptions): Promise<boolean> {
    logger.info(`[MailService] Dispatching email to: ${options.to} | Subject: ${options.subject}`);
    // Transport abstraction - logs and resolves true for dev fallback
    if (process.env.NODE_ENV === 'development') {
      logger.info(`[MailService DEV Output] Host: ${mailConfig.host}:${mailConfig.port}`);
    }
    return true;
  }
}

export const mailService: IMailService = new MailService();
