import pino from 'pino';

const logger = pino({
  name: process.env.APP_NAME,
  level: 'debug',
  prettyPrint: true,
});

export default logger;
