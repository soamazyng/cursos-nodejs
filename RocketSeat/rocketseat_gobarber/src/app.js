import * as Sentry from '@sentry/node';

import 'dotenv/config';

import express, { json } from 'express';

import path from 'path';

import cors from 'cors';

import 'express-async-errors';

import Youch from 'youch';

import './database';
import routes from './routes';

import sentryConfig from './config/sentry';

class App {
  constructor() {
    this.server = express();

    Sentry.init(sentryConfig);

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    if (process.env.NODE_ENV === 'production') {
      // The request handler must be the first middleware on the app
      this.server.use(Sentry.Handlers.requestHandler());
    }

    this.server.use(json());
    this.server.use(cors());
    // precisa colocar este middleware para permitir o acesso a arquivos estáticos via url
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);

    if (process.env.NODE_ENV === 'production') {
      // The error handler must be before any other error middleware and after all controllers
      this.server.use(Sentry.Handlers.errorHandler());
    }
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();
        return res.status(500).json(errors);
      }

      return res.status(500).json({ Error: 'Internal server error' });
    });
  }
}

export default new App().server;
