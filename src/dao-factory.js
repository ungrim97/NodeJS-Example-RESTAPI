const _daos = {};

module.exports = class DaoFac {
  constructor(store) {
    this.store = store;
    this.daos = _daos;
  }

  daoFor(daoName) {
    return new Promise((resolve, reject) => {
      const dao = this.daos[daoName];

      if (!dao) {
        reject(new Error(`No DAO for ${daoName}`));
      }

      resolve(dao);
    });
  }
};
