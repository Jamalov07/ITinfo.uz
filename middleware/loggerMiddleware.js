const expressWinston = require("express-winston");
const { transports, format } = require("winston");
const { combine, json, metadata } = format;
const config = require("config");
require("winston-mongodb");

const winstonLogger = expressWinston.logger({
  transports: [
    new transports.Console(),
    new transports.MongoDB({
      db: config.get("dbAdr"),
      options: { useUnifiedTopology: true },
      storeHost: true,
      capped: true,
    }),
  ],
  format: combine(json(), metadata()),
  meta: true,
  msg: "HTTP {{req.method}} {{req.url}}",
  expressFormat: true,
  colorize: false,
  ignoreRoute: function (req, res) {
    return false;
  },
});

const errLogger = expressWinston.errorLogger({
  transports: [
    new transports.Console(),
    new transports.MongoDB({
      db: config.get("dbAdr"),
      options: { useUnifiedTopology: true },
      storeHost: true,
      capped: true,
    }),
  ],
  format: combine(format.colorize(), format.metadata()),
});

module.exports = {
  winstonLogger,
  errLogger,
};
