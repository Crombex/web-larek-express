import winston from 'winston';
import expressWinston from 'express-winston';
import path from 'path';

export const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({
      filename: path.resolve(__dirname, '../../', 'logs/request.log'),
    }),
  ],
  meta: true,
  msg: 'HTTP {{req.method}} {{req.url}};',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
    winston.format.json(),
  ),
});

export const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({
      filename: path.resolve(__dirname, '../../', 'logs/error.log'),
    }),
  ],
  meta: true,
  format: winston.format.combine(
    winston.format.json(),
    winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
  ),
});
