'use strict';
/**
 * @class
 * @property {integer} id - Identifier of the message
 * @property {string} text - The text of the messsage
 * @property {string} owner - The id of the owner in the remote system
 * @property {string} createdAt - The datetime the message was created at (RFC-3339)
 * @property {string} updatedAt - The datetime the message was last updated at (RFC-3339)
 * @property {string} createdBy - The remote system that created the message
 * @property {string} updatedBy - The remote system that updated the message
 */
module.exports = class Message {
  constructor(args) {
    this.id = args.id;
    this.text = args.text;
    this.owner = args.owner;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
    this.createdBy = args.createdBy;
    this.updatedBy = args.updatedBy;
  }

  /* Instance Methods */

  /**
   * Update a single message
   *
   * @param {Object} deps - Dependencies
   * @param {DaoFac} deps.daoFac - Dao Factory
   * @param {KoaServerTimings} deps.timings - Instance of a Koa Server Timings object (optional)
   * @param {Object} args - function arguments
   * @param {string} args.text - Updated message text
   * @param {string} args.owner - Updated owner id
   *
   * @returns {Promise<Message>} - Resolves a Message object
   */
  update(deps, args) {
    deps = deps || {};
    args = args || {};

    if (!deps.daoFac) {
      throw new Error(
        '`deps.daoFac` is a required argument to message.update()'
      );
    }

    if (!this.id) {
      throw new Error('`this.id` is a required argument to message.update()');
    }

    if (!args.text && !args.owner) {
      throw new Error('message.update() expects at least `text` or `owner`');
    }

    if (!args.updatedBy) {
      throw new Error(
        '`args.updatedBy` is a required argument to message.update()'
      );
    }

    if (deps.timings) {
      deps.timings.startSpan('message:update');
    }

    const updateData = {
      updatedBy: args.updatedBy
    };

    if (args.text) {
      updateData.text = args.text;
    }

    if (args.owner) {
      updateData.owner = args.owner;
    }

    return deps.daoFac
      .daoFor('message')
      .update(deps, this.id, updateData)
      .then(message => {
        if (deps.timings) {
          deps.timings.stopSpan('message:update');
        }

        if (!message) {
          throw Error('Failure to retrieve newly updated message');
        }

        return new Message(message);
      })
      .catch(error => {
        if (deps.timings) {
          deps.timings.stopSpan('message:update');
        }

        throw error;
      });
  }

  /**
   * Create a single message
   *
   * @param {Object} deps - Injected Dependencies
   * @param {DaoFac} deps.daoFac - Dao Factory
   * @param {KoaServerTimings} [deps.timings] - Instance of a Koa Server Timings object (optional)
   *
   * @returns {Promise<Message>} Message - Resolves the created Message object
   * @throws {Error} '`deps.daoFac` is a required argument to message.create()'
   * @throws {Error} 'Cannot call message.create() on message already in storage'
   */
  create(deps) {
    deps = deps || {};
    if (!deps.daoFac) {
      throw new Error(
        '`deps.daoFac` is a required argument to message.create()'
      );
    }

    if (this.id) {
      throw new Error(
        'Cannot call message.create() on message already in storage'
      );
    }

    if (deps.timings) {
      deps.timings.startSpan('message:create');
    }

    return deps.daoFac
      .daoFor('message')
      .create(deps, {
        createdBy: this.createdBy,
        text: this.text,
        owner: this.owner
      })
      .then(message => {
        if (deps.timings) {
          deps.timings.stopSpan('message:create');
        }

        if (!message) {
          throw Error('Failure to retrieve newly created message');
        }

        return new Message(message);
      })
      .catch(error => {
        if (deps.timings) {
          deps.timings.stopSpan('message:create');
        }

        throw error;
      });
  }

  /**
   * Delete a single message
   *
   * @param {Object} deps - Injected Dependencies
   * @param {DaoFac} deps.daoFac - Dao Factory
   * @param {KoaServerTimings} [deps.timings] - Instance of a Koa Server Timings object (optional)
   *
   * @returns {Promise<Message>} - Resolves the deleted Message object
   * @throws {Error} '`deps.daoFac` is a required argument to message.delete()'
   * @throws {Error} '`this.id` is a required argument to message.delete()'
   */
  delete(deps) {
    deps = deps || {};
    if (!deps.daoFac) {
      throw new Error(
        '`deps.daoFac` is a required argument to message.delete()'
      );
    }

    if (!this.id) {
      throw new Error('`this.id` is a required argument to message.delete()');
    }

    if (deps.timings) {
      deps.timings.startSpan('message:delete');
    }

    return deps.daoFac
      .daoFor('message')
      .delete(deps, this.id)
      .then(message => {
        if (deps.timings) {
          deps.timings.stopSpan('message:delete');
        }

        if (!message) {
          return;
        }

        return new Message(message);
      })
      .catch(error => {
        if (deps.timings) {
          deps.timings.stopSpan('message:delete');
        }

        throw error;
      });
  }

  /* Static methods */
  /**
   * Find a single message
   *
   * @param {Object} deps - Injected Dependencies
   * @param {DaoFac} deps.daoFac - Dao Factory
   * @param {KoaServerTimings} [deps.timings] - Instance of a Koa Server Timings object (optional)
   * @param {integer} id - Id of the message to find
   *
   * @returns {Promise<Message>} - Resolves to the found Message object
   * @throws {Error} '`deps.daoFac` is a required argument to Message.find()'
   * @throws {Error} '`id` is a required argument to Message.find()'
   */
  static find(deps, id) {
    deps = deps || {};
    if (!deps.daoFac) {
      throw new Error('`deps.daoFac` is a required argument to Message.find()');
    }

    if (!id) {
      throw new Error('`id` is a required argument to Message.find()');
    }

    if (deps.timings) {
      deps.timings.startSpan('message:find');
    }

    return deps.daoFac
      .daoFor('message')
      .find(deps, id)
      .then(message => {
        if (deps.timings) {
          deps.timings.stopSpan('message:find');
        }

        if (!message) {
          return;
        }

        return new Message(message);
      })
      .catch(error => {
        if (deps.timings) {
          deps.timings.stopSpan('message:find');
        }

        throw error;
      });
  }

  /**
   * Retrieve the total number of messages in storage
   *
   * @param {Object} deps - Injected Dependencies
   * @param {DaoFac} deps.daoFac - Dao Factory
   * @param {KoaServerTimings} [deps.timings] - Instance of a Koa Server Timings object (optional)
   *
   * @returns {Promise<integer>} count - Resolves to the total number of messages
   * @throws {Error} '`deps.daoFac` is a required argument to Message.getTotal()'
   */
  static getTotal(deps, args) {
    deps = deps || {};
    if (!deps.daoFac) {
      throw new Error(
        '`deps.daoFac` is a required argument to Message.getTotal()'
      );
    }

    if (deps.timings) {
      deps.timings.startSpan('message:totalMessage');
    }

    return deps.daoFac
      .daoFor('message')
      .totalMessages(deps)
      .then(totalCount => {
        if (deps.timings) {
          deps.timings.stopSpan('message:totalMessage');
        }

        return totalCount;
      })
      .catch(error => {
        if (deps.timings) {
          deps.timings.stopSpan('message:totalMessage');
        }

        throw error;
      });
  }

  /**
   * Fetch all messages
   *
   * @param {Object} deps - Injected Dependencies
   * @param {DaoFac} deps.daoFac - Dao Factory
   * @param {KoaServerTimings} [deps.timings] - Instance of a Koa Server Timings object (optional)
   * @param {Object} [args] - function arguments
   * @param {integer} [args.limit] - maximum number of messages to return
   * @param {integer} [args.offset=0] - number of messages to ignore before returning
   *
   * @returns {Promise<Array>} - Resolves to all retrieved Message object
   * @throws {Error} '`deps.daoFac` is a required argument to Message.getAll()'
   */
  static getAll(deps, args) {
    deps = deps || {};
    if (!deps.daoFac) {
      throw new Error(
        '`deps.daoFac` is a required argument to Message.getAll()'
      );
    }

    if (deps.timings) {
      deps.timings.startSpan('message:getAll');
    }

    const query = {};
    if (args.limit) {
      query.limit = args.limit;
      query.offset = args.offset || 0;
    }

    return deps.daoFac
      .daoFor('message')
      .getAll(deps, query)
      .filter(message => message)
      .map(message => new Message(message))
      .then(messages => {
        if (deps.timings) {
          deps.timings.stopSpan('message:getAll');
        }

        return messages;
      })
      .catch(error => {
        if (deps.timings) {
          deps.timings.stopSpan('message:getAll');
        }

        throw error;
      });
  }
};
