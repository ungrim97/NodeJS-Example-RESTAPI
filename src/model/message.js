'use strict';
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
   * @args {Object} deps.daoFac - Dao Factory
   * @args {Object} deps.timings - Instance of a Koa Server Timings object (optional)
   * @args {string} args.text - Updated message text
   * @args {string} args.owner - Updated owner id
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
      .then(dao => {
        return dao.update(deps, this.id, updateData);
      })
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
   * @args {Object} deps.daoFac - Dao Factory
   * @args {Object} deps.timings - Instance of a Koa Server Timings object (optional)
   * @returns {Promise<Message>} - Resolves a Message object
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
      .then(dao => {
        return dao.create(deps, {
          createdBy: this.createdBy,
          text: this.text,
          owner: this.owner
        });
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
   * @args {Object} deps.daoFac - Dao Factory
   * @args {Object} deps.timings - Instance of a Koa Server Timings object (optional)
   * @returns {Promise<Message>} - Resolves a Message object
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
      .then(dao => dao.delete(deps, this.id))
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
   * @args {Object} deps.daoFac - Dao Factory
   * @args {Object} deps.timings - Instance of a Koa Server Timings object (optional)
   * @args {integer} id - Id of the message to find
   * @returns {Promise<Message>} - Resolves a Message object
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
      .then(dao => {
        return dao.find(deps, id);
      })
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
   * @args {Object} deps.daoFac - Dao Factory
   * @args {Object} deps.timings - Instance of a Koa Server Timings object (optional)
   * @returns {Promise<integer>} count - Resolves to the total number of messages
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
      .then(dao => {
        return dao.totalMessages(deps);
      })
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
   * @args {Object} deps.daoFac - Dao Factory
   * @args {Object} deps.timings - Instance of a Koa Server Timings object (optional)
   * @args {integer} args.limit - maximum number of messages to return
   * @args {integer} args.offset - number of messages to ignore before returning (default: 0)
   * @returns {Promise<Array[Message]>} - Resolves to all retrieved Message object
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
      .then(dao => dao.getAll(deps, query))
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
