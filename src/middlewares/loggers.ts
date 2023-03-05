import winston from 'winston';
import expressWinston from 'express-winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { logs } from '../types/constants';

const requestTransport: DailyRotateFile = new DailyRotateFile({
  filename: 'requests-%Date%.log',
  dirname: './logs',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: logs.MAX_SIZE,
  maxFiles: logs.MAX_FILES,
});
export const requestLogger = expressWinston.logger({
  transports: [
    requestTransport,
  ],
  format: winston.format.json(),
});

const errorTransport: DailyRotateFile = new DailyRotateFile({
  filename: 'errors-%Date%.log',
  dirname: './logs',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: logs.MAX_SIZE,
  maxFiles: logs.MAX_FILES,
});
export const errorLogger = expressWinston.errorLogger({
  transports: [
    errorTransport,
  ],
  format: winston.format.json(),
});
