import nodemailer from 'nodemailer';

import { resolve } from 'path';

import exphbs from 'express-handlebars';

import nodemailerhbs from 'nodemailer-express-handlebars';

import mailConfig from '../config/mail';

class Mail {
  constructor() {
    const { host, port, secure, auth } = mailConfig;

    // o auth em algum momento pode ser null
    // por isso que eu verifico se a configuração faz uso do auth
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null,
    });

    /**
     * Configuring templates
     */
    this.configureTemplates();
  }

  configureTemplates() {
    const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails');

    const handlebarOptions = exphbs.create({
      viewEngine: {
        layoutsDir: resolve(viewPath, 'layouts'),
        partialsDir: resolve(viewPath, 'partials'),
        extname: '.hbs',
        defaultLayout: 'default.hbs',
        extName: '.hbs',
      },
      viewPath,
      extName: '.hbs',
    });

    this.transporter.use('compile', nodemailerhbs(handlebarOptions));
  }

  sendMail(message) {
    return this.transporter.sendMail({
      ...mailConfig.default,
      ...message,
    });
  }
}

export default new Mail();
