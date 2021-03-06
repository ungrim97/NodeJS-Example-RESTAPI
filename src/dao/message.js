'use strict';
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
   *  Returns a single message from storage as identified by its primary key
   *
   *  @args {Object} deps.timings - Instance of a Koa Server Timings object (option)
   *  @args {integer} id - Id of the message to retrieve
   *
   *  @returns Promise<Object> message
   */
  find(deps, id) {
    deps = deps || {};
    if (deps.timings) {
      deps.timings.startSpan('messageDao:find');
    }

    if (!id) {
      throw new Error('`id` is a required argument to MessageDao.find()');
    }

    return this.store.messageStore.models.message
      .findByPk(id)
      .then(message => {
        if (deps.timings) {
          deps.timings.stopSpan('messageDao:find');
        }

        return message;
      })
      .catch(error => {
        if (deps && deps.timings) {
          deps.timings.stopSpan('messageDao:find');
        }

        throw error;
      });
  }

  /**
   *  Deletes a single message from storage as identified by its primary key
   *
   *  @args {Object} deps.timings - Instance of a Koa Server Timings object (option)
   *  @args {integer} id - Id of the message to retrieve
   *
   *  @returns Promise<Object> message
   */
  delete(deps, id) {
    deps = deps || {};
    if (deps.timings) {
      deps.timings.startSpan('messageDao:delete');
    }

    if (!id) {
      throw new Error('`id` is a required argument to MessageDao.delete()');
    }

    return this.store.messageStore.models.message
      .destroy({ where: { id: id } })
      .then(message => {
        if (deps.timings) {
          deps.timings.stopSpan('messageDao:delete');
        }

        return message;
      })
      .catch(error => {
        if (deps && deps.timings) {
          deps.timings.stopSpan('messageDao:delete');
        }

        throw error;
      });
  }

  /**
   *  Update a message in storage
   *
   * @args {Object} deps.timings - Instance of a Koa Server Timings object (option)
   * @args {integer} id - id of the message to update
   * @args (string) args.text - Text data of the message
   * @args (string) args.owner - onder identifier in remote system
   * @args (string) args.updatedBy - Remote System identifier (required)
   */
  update(deps, id, args) {
    deps = deps || {};

    if (deps.timings) {
      deps.timings.startSpan('messageDao:update');
    }

    if (!id) {
      throw new Error('`id` is a required argument to MessageDao.update()');
    }

    if (!args.updatedBy) {
      throw new Error(
        '`updatedBy` is a required argument to MessageDao.update()'
      );
    }

    if (!args.text && !args.owner) {
      throw new Error(
        'MessageDao.update() expects `text` and/or `owner` arguments'
      );
    }

    return this.store.messageStore.models.message
      .update(Object.assign(args, { updatedAt: new Date() }), {
        where: { id: id }
      })
      .then(message => {
        if (deps.timings) {
          deps.timings.stopSpan('messageDao:update');
        }

        return message;
      })
      .catch(error => {
        if (deps.timings) {
          deps.timings.stopSpan('messageDao:update');
        }

        throw error;
      });
  }

  /**
   * Create a new message in storage
   *
   * @args {Object} deps.timings - Instance of a Koa Server Timings object (option)
   * @args (string) args.text - Text data of the message (required)
   * @args (string) args.owner - onder identifier in remote system
   * @args (string) args.createdBy - Remote System identifier
   */
  create(deps, args) {
    deps = deps || {};
    args = args || {};
    if (deps.timings) {
      deps.timings.startSpan('messageDao:create');
    }

    for (const arg of ['owner', 'text', 'createdBy']) {
      if (!args[arg]) {
        throw new Error(
          `\`${arg}\` is a required argument to MessageDao.create()`
        );
      }
    }

    return this.store.messageStore.models.message
      .create({
        text: args.text,
        createdBy: args.createdBy,
        updatedBy: args.createdBy,
        owner: args.owner
      })
      .then(message => {
        if (deps.timings) {
          deps.timings.stopSpan('messageDao:create');
        }

        return message;
      })
      .catch(error => {
        if (deps.timings) {
          deps.timings.stopSpan('messageDao:create');
        }

        throw error;
      });
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
