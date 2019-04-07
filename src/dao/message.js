const Promise = require('bluebird');

/**
 * Data Access layer object for the Message data
 *
 * @constructor
 * @args {Object} store - Instance of the store object
 */

module.exports = class MessageDao {
  constructor(store) {
    if (!store) {
      throw new Error('Instance of Store is required');
    }

    this.store = store;
  }

  /**
   * Return the total number of messages in storage
   *
   * @args {Object} deps.timings - Instance of a Koa Server Timings object (optional)
   */

  totalMessages(deps) {
    deps = deps || {};
    if (deps.timings) {
      deps.timings.startSpan('messageDao:totalMessages');
    }

    return this.store.messageStore.models.message
      .count()
      .then(totalMessages => {
        if (deps.timings) {
          deps.timings.stopSpan('messageDao:totalMessages');
        }

        return totalMessages;
      })
      .catch(error => {
        if (deps && deps.timings) {
          deps.timings.stopSpan('messageDao:totalMessages');
        }

        throw error;
      });
  }

  /**
   * Return all message in storage
   *
   * @args {Object} deps.timings - Instance of a Koa Server timings
   * @args {integer} args.limit - Max number of messages to return
   * @args {integer} args.offset - Offset before retrieving messages
   */

  getAll(deps, args) {
    deps = deps || {};
    if (deps.timings) {
      deps.timings.startSpan('messageDao:getAll');
    }

    return this.store.messageStore.models.message
      .findAll(args)
      .then(messages => {
        if (deps.timings) {
          deps.timings.stopSpan('messageDao:getAll');
        }

        return messages;
      })
      .catch(error => {
        if (deps.timings) {
          deps.timings.stopSpan('messageDao:getAll');
        }

        throw error;
      });
  }
};
