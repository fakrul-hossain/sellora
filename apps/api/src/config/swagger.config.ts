import { env } from './env.config.js';

export const swaggerConfig = {
  openapi: '3.0.0',
  info: {
    title: 'SELLORA Enterprise E-Commerce API',
    version: '1.0.0',
    description: 'Production-grade API specifications for SELLORA multi-vendor e-commerce platform.',
    contact: {
      name: 'SELLORA Engineering Team',
      email: 'tech@sellora.com',
    },
  },
  servers: [
    {
      url: `http://localhost:${env.PORT}${env.API_PREFIX}`,
      description: 'Local Development Server',
    },
  ],
};
