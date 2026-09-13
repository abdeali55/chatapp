import express, { type Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from '@/middleware/error-handler';
import { createInternalAuthMiddleware } from '@chatapp/common';
import { env } from './config/env';

export const createApp = (): Application => {
  const app = express();
  app.use(helmet());
  app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(createInternalAuthMiddleware(env.INTERNAL_API_TOKEN, {
    exemptPaths: ['/users/health']
  }))

  app.use((_req, res) => {
    res.status(404).json({ message: 'Not Found' });
  });

  app.use(errorHandler);

  return app;
};
