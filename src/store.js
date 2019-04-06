const messageStore = require('./store/message-store');
/**
 * Object encapsulating access to all data stores
 *
 * @arg {Object} config - Store config object. Should contain keys to each store
 */
module.exports = class Store {
  constructor(config) {
    this.config = config;
    this.initStores();
  }

  initStores() {
    this.messageStore = messageStore(this.config.get('message_store'));
  }
};
