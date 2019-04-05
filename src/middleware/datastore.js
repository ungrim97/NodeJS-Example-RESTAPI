const Store = require('../store');
const DaoFac = require('../dao-factory');

/*
 * Simple middleware to add a data Store and Data Access Object factory to ctx
 *
 * ctx.store - Store Object
 * ctx.daoFac - Data Access Object factory
 */

module.exports = config => {
  const store = new Store(this.config);
  const daoFac = new DaoFac(store);

  return (ctx, next) => {
    ctx.store = store;
    ctx.daoFac = daoFac;

    next();
  };
};
