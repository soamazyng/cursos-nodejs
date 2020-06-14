import { RedisOptions } from 'ioredis';

interface ICacheConfig {
  driver: 'redis';
  config: {
    redis: RedisOptions;
  };
}

export default {
  driver: process.env.CACHE_PROVIDER,
  config: {
    redis: {
      host: process.env.REDIS_ENDPOINT,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
    },
  },
} as ICacheConfig;
