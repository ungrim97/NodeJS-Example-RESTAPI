'use strict';
const router = require('koa-router')();

/**
 * Base router. These are resources applied to '/'
 */

module.exports = config => {
  /**
   * Healthcheck route. Used ad a test that the app is running
   * {
   *    status: "ok",
   *    version: 1.0.0
   * }
   */

  router.get('/healthcheck', ctx => {
    ctx.state.timings.startSpan('healthcheck');

    ctx.body = {
      status: 'ok',
      version: config.get('version')
    };

    ctx.state.timings.stopSpan('healthcheck');
  });

  return router;
};
