import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: 'info', // log levels: error, warn, info, verbose, debug
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(info => `[${info.timestamp}] [${info.level.toUpperCase()}] ${info.message}`)
  ),
  transports: [
    new transports.Console(), // log to console
    new transports.File({ filename: 'logs/execution.log' }) // log to file
  ],
});

export default logger;
