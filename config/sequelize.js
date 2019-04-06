const config = require('config');

const dbConf = {
  username: config.get('store.message_store.user'),
  password: config.get('store.message_store.password'),
  host: config.get('store.message_store.host'),
  database: config.get('store.message_store.database'),
  dialect: config.get('store.message_store.dialect')
};

module.exports = {
  development: dbConf,
  test: dbConf,
  production: dbConf
};
