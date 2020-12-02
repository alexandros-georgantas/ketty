const { deferConfig } = require('config/defer')
const path = require('path')
const winston = require('winston')
require('winston-daily-rotate-file')

const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      colorize: true,
      handleExceptions: true,
      humanReadableUnhandledException: true,
    }),
    new winston.transports.DailyRotateFile({
      filename: 'app-%DATE%.log',
      dirname: path.join(__dirname, '../logs/dev'),
      datePattern: 'DD-MM-YYYY',
      zippedArchive: true,
      maxFiles: '30d',
      json: true,
      handleExceptions: true,
      humanReadableUnhandledException: true,
    }),
  ],
})

module.exports = {
  'pubsweet-server': {
    baseUrl: deferConfig(
      cfg => `http://localhost:${cfg['pubsweet-server'].port}`,
    ),
    logger,
  },
  'pubsweet-component-ink-backend': {
    inkEndpoint: 'http://dummyURL.com/',
    email: 'user@example.com',
    password: 'somepassword',
    recipes: {
      'editoria-typescript': '2',
    },
  },
}
