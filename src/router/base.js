'use strict';
const router = require('koa-router')();

/**
 * Base router. These are resources applied to '/'
 *
 * @param {Object} config - Application Config
 * @returns {Object} router - Koa Router instance
 */
module.exports = config => {
  /**
   * @swagger
   * definitions:
   *   Healthcheck:
   *     type: object
   *     properties:
   *       status:
   *         type: string
   *         example: ok
   *       version:
   *         type: string
   *         example: 1.0.0
   */
  /**
   * @swagger
   * /healthcheck:
   *   get:
   *     tags:
   *       - Healthcheck
   *     description: Returns server status
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         schema:
   *           $ref: '#/definitions/Healthcheck'
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
