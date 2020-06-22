import express, { json } from 'express';
import 'dotenv/config';
import path from 'path';
import setTZ from 'set-tz';
import routes from './routes';

// contém a configuração das models, sem isso não funciona o sequelize
import './database';

class App {
  constructor() {
    setTZ('UTC'); // define o relógio do computador igual o do NODE.JS
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(json());

    // precisa colocar este middleware para permitir o acesso a arquivos estáticos via url
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
