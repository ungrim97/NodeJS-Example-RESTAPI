'use strict';
const winston = require('winston');

const transportOpts =
  process.env.NODE_ENV === 'testing' ? { silent: true } : {};

winston.loggers.add('app', {
  level: process.env.MS_APP_LOG_LEVEL || 'warn',
  format: winston.format.combine(
    winston.format.label({ label: 'app' }),
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [new winston.transports.Console(transportOpts)]
});

winston.loggers.add('dao', {
  level: process.env.MS_APP_LOG_LEVEL || 'warn',
  format: winston.format.combine(
    winston.format.label({ label: 'dao' }),
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [new winston.transports.Console(transportOpts)]
});

let accessTransport = new winston.transports.Console(transportOpts);
if (process.env.ACCESS_LOG_FILE) {
  accessTransport = new winston.transports.File(
    Object.assign(
      {
        filename: process.env.ACCESS_LOG_FILE
      },
      transportOpts
    )
  );
}

winston.loggers.add('accessLog', {
  level: process.env.MS_APP_LOG_LEVEL || 'warn',
  format: winston.format.combine(
    winston.format.label({ label: 'accessLog' }),
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [accessTransport]
});

module.exports = {
  appLog: winston.loggers.get('app'),
  daoLog: winston.loggers.get('dao'),
  accessLog: winston.loggers.get('accesslog'),
  accesslogStream: {
    write: message => {
      winston.loggers.get('accessLog').info(message);
    }
  }
};
