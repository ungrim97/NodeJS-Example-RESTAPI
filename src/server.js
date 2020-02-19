'use strict';
// External Libs
const compress = require('koa-compress');
const conditional = require('koa-conditional-get');
const etags = require('koa-etag');
const Koa = require('koa');
const serve = require('koa-static');
const serverTiming = require('koa-server-timing');
const swaggerUI = require('koa2-swagger-ui');
const morgan = require('koa-morgan');
const mount = require('koa-mount');

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

/**
 * @class
 * @param {Object} config - Application config
 * @property {Object} app - Koa instance
 * @property {Object} config - Application config
 */
module.exports = class Server {
  constructor(config) {
    this.app = new Koa();
    this.config = config;
  }

  /**
   * Fully initialise the Web Server
   *
   * @constructs
   * @param {Object} config - Application config
   */
  static bootstrap(config) {
    const server = new Server(config);
    server.init();

    return server;
  }

  /**
   * Initialise application middleware/routes etc
   */
  init() {
    // Add Server timings header
    this.app.use(serverTiming());

    // Output request logs
    this.app.use(
      morgan(
        ':remote-addr :session_user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ":reqid"',
        { stream: logger.accesslogStream }
      )
    );

    // Add unique requestId header
    this.app.use(requestId());

    // Gzip responses
    this.app.use(compress());

    // Conditional GET support
    this.app.use(conditional());
    this.app.use(etags());

    // Static
    this.app.use(mount('/api-docs', serve(__dirname + '/../api-docs')));

    // Serve Swagger UI/Docs
    this.app.use(
      swaggerUI({
        // Swagger UI path
        routePrefix: '/swagger-ui',
        swaggerOptions: {
          // Docs path
          url: '/api-docs/openapi.json'
        }
      })
    );

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
