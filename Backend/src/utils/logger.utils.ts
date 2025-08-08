// import { createLogger, format, transports } from "winston";

// const { combine, colorize, timestamp, json } = format;

// const logger = createLogger({
//   level: "debug",
//   format: combine(colorize(), timestamp(), json()),
//   transports: [new transports.Console()],
// });

// export default logger;
import { createLogger, format, transports } from 'winston';
const { combine, timestamp, printf, colorize, errors } = format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

const logger = createLogger({
  level: 'debug',
  format: combine(
    colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
  ],
});

export default logger;