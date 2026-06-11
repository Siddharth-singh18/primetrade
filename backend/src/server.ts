import app from './app';
import { env } from './config/env';
import { logger } from './utils/logger';
import { connectDB } from './config/db';
import { connectRedis } from './config/redis';

const startServer = async () => {
  await connectDB();
  await connectRedis();

  const PORT = env.PORT || 5000;

  app.listen(PORT, () => {
    logger.info(`Server running in ${env.NODE_ENV} mode on port ${PORT}`);
  });
};

startServer();
