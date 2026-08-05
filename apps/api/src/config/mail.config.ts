import { env } from './env.config.js';

export const mailConfig = {
  host: env.MAIL_HOST || 'smtp.mailtrap.io',
  port: env.MAIL_PORT || 2525,
  auth: {
    user: env.MAIL_USER || '',
    pass: env.MAIL_PASS || '',
  },
  from: env.MAIL_FROM,
};
