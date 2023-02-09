module.exports = [
  {
    name: 'default',
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    schema: process.env.DB_SCHEMA,
    entities: ['./src/modules/**/infra/typeorm/entities/*.ts'],
    migrations: ['./src/shared/infra/typeorm/migrations/*.ts'],
    cli: {
      migrationsDir: './src/shared/infra/typeorm/migrations',
    },
  },
  {
    name: 'mongo',
    type: 'mongodb',
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    url: process.env.MONGODB_HOST,
    port: process.env.MONGODB_PORT,
    useUnifiedTopology: true,
    database: process.env.MONGODB_DATABASE,
    entities: ['./src/modules/**/infra/typeorm/schemas/*.ts'],
  },
];
