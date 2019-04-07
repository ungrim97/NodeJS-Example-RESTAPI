// External Libs
const compress = require('koa-compress');
const Koa = require('koa');
const serverTiming = require('koa-server-timing');
const status = require('http-status');
const morgan = require('koa-morgan');

// Internal Libs
const logger = require('./logger');

// Internal MiddleWare
const datastore = require('./middleware/datastore');
const requestId = require('./middleware/request-id');

// Routers
const baseRouter = require('./router/base');
const messageRouter = require('./router/message');

// Global setup
morgan.token('session_user', req => (req.user ? req.user.username : null));
morgan.token('reqid', req => req.reqid);

module.exports = class Server {
  constructor(config) {
    this.app = new Koa();
    this.config = config;
  }

  static bootstrap(config) {
    const server = new Server(config);
    server.init();

    return server;
  }

  async init() {
    // Base app Middleware
    this.app.use(serverTiming());
    this.app.use(
      morgan(
        ':remote-addr :session_user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ":reqid"',
        { stream: logger.accesslogStream }
      )
    );
    this.app.use(requestId());
    this.app.use(compress());

    // Add dataStore and DaoFactory
    this.app.use(datastore(this.config.get('store')));

    // Routers
    this.app.use(baseRouter(this.config).routes());
    this.app.use(messageRouter(this.config).routes());

    // Top level Error logger
    this.app.on('error', error => {
      logger.appLog.error('Error: ' + error.message);
      logger.appLog.debug('Debug Error: ', error);
    });
  }
};
