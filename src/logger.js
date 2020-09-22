import winston from 'winston';
import fs from 'fs';
import path from 'path';

const { createLogger, format, transports } = winston;
const env = process.env.NODE_ENV || 'development';
const logDir = 'log';

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const filename = path.join(logDir, 'results.log');

export const logger = createLogger({
    level: env === 'production' ? 'info' : 'debug',
    format: format.combine(
      format.label({ label: 'LINE' }),
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })
    ),
  
    transports: [
      new transports.Console({
        format: format.combine(
          format.colorize(),
          format.json(),
          format.printf(
            info =>
              `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
          )
        )
      }),
    
      new transports.File({
        filename,
        format: format.combine(
          format.json(),
          format.printf(
            info =>
              `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`
          )
        )
      })
    ]
  });
