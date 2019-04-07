const fs = require('fs');
const jwt = require('koa-jwt');
const Promise = require('bluebird');
const router = require('koa-router')();

/**
 * Message router. These are resources applied to '/message'
 */

module.exports = config => {
  /* All routes here are JWT authenticated */
  router.use(
    jwt({
      secret: fs.readFileSync(config.get('publickey'))
    })
  );

  return router;
};
