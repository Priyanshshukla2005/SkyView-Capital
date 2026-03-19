const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');

let server;
const startServer = () => {
  if (server) return;
  server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  });
};

mongoose
  .connect(config.mongoose.url, config.mongoose.options)
  .then(() => {
    logger.info('Connected to MongoDB');
    startServer();
  })
  .catch((err) => {
    // In development, it's better to keep the HTTP server running so the frontend
    // doesn't fail with "Failed to fetch" and we can surface a clear error.
    logger.error(err);
    logger.warn('MongoDB connection failed. API will not work correctly until DB is reachable.');
    startServer();
  });

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
