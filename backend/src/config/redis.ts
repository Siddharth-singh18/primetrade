import { createClient } from 'redis';
import { env } from './env';
import { logger } from '../utils/logger';

// Create a dummy client to avoid crashes if Redis auth fails locally
let isConnected = false;

export const redisClient = createClient({
  url: env.REDIS_URL,
});

redisClient.on('error', (err) => {
  // Ignore endless reconnect errors to prevent log spam
});

redisClient.on('connect', () => {
  isConnected = true;
  logger.info('Redis Connected');
});

export const connectRedis = async () => {
  try {
    // Don't await, let it connect in background to avoid blocking server start
    redisClient.connect().catch(() => {
        logger.warn('Failed to connect to Redis. Caching will be disabled.');
    });
  } catch (error: any) {
    logger.error(`Redis Connection Error: ${error.message}`);
  }
};

// Safe wrapper for cache operations
export const cache = {
  get: async (key: string) => isConnected ? await redisClient.get(key).catch(()=>null) : null,
  setEx: async (key: string, ttl: number, val: string) => isConnected ? await redisClient.setEx(key, ttl, val).catch(()=>null) : null,
  del: async (key: string) => isConnected ? await redisClient.del(key).catch(()=>null) : null,
};
