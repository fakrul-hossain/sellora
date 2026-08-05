import { env } from './env.config.js';

export const jwtConfig = {
  accessSecret: env.JWT_SECRET,
  accessExpiresIn: env.JWT_EXPIRES_IN,
  refreshSecret: env.JWT_REFRESH_SECRET,
  refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
  issuer: 'SELLORA_PLATFORM',
  audience: 'SELLORA_USERS',
};
