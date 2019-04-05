/**
 * Middleware to add a short requestId
 */
module.exports = () => {
  return (ctx, next) => {
    // Morgan looks on the request additional token data
    // so store the reqid on the ctx.req and ctx.store for
    // compatibility
    ctx.store = ctx.store || {};
    ctx.req.reqid = ctx.store.reqid = Math.random()
      .toString(36)
      .substr(2, 9);
    ctx.set('X-Request-Id', ctx.store.reqid);

    next();
  };
};
