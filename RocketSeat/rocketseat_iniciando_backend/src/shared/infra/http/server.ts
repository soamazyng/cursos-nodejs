import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import 'express-async-errors';

import { errors } from 'celebrate';

import expressPinoLogger from 'express-pino-logger';
import logger from '@config/logger';

import 'reflect-metadata';

import '../typeorm';
import '@shared/container';
import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import rateLimiter from './middlewares/rateLimiter';
import routes from './routes';

const app = express();
app.use(expressPinoLogger({ logger }));

app.use(rateLimiter);
app.use(cors());

app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(routes);
app.use(errors());

// error global
app.use(
  (error: Error, request: Request, response: Response, _: NextFunction) => {
    if (error instanceof AppError) {
      return response.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    }

    logger.error(error);

    return response.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  },
);

app.listen(process.env.PORT_DEFAULT, () => {
  logger.info(`🚀 Server started on port ${process.env.PORT_DEFAULT}`);
});
