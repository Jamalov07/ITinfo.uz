const config = require("config");
const winston = require("winston");

const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf, prettyPrint, json, colorize } = format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});
require("winston-mongodb");
let logger;

const devLog = createLogger({
  format: combine(timestamp(), myFormat),
  transports: [
    new transports.Console({ level: "debug" }),
    new transports.File({ filename: "logs/errors.log", level: "error" }),
    new transports.File({ filename: "logs/combined.log", level: "info" }),
    new transports.MongoDB({
      db: config.get("dbAdr"),
      options: { useUnifiedTopology: true },
    }),
  ],
  exceptionHandlers: [new transports.File({ filename: "logs/exceptions.log" })],
  rejectionHandlers: [new transports.File({ filename: "logs/rejections.log" })],
});
const prodLog = createLogger({
  format: combine(timestamp(), myFormat),
  transports: [
    new transports.Console({ level: "debug" }),
    new transports.File({ filename: "logs/errors.log", level: "error" }),
    new transports.File({ filename: "logs/combined.log", level: "info" }),
    new transports.MongoDB({
      db: config.get("dbAdr"),
      options: { useUnifiedTopology: true },
    }),
  ],
  exceptionHandlers: [new transports.File({ filename: "logs/exceptions.log" })],
  rejectionHandlers: [new transports.File({ filename: "logs/rejections.log" })],
});

// logger.exitOnError = false;
if (process.env.NODE_ENV == "production") {
  logger = prodLog;
} else {
  logger = devLog;
}

module.exports = logger;
