'use strict';
const bodyParser = require('koa-bodyparser');
const fs = require('fs');
const jwt = require('koa-jwt');
const paginator = require('koa-ctx-paginate');
const Promise = require('bluebird');
const router = require('koa-router')();
const status = require('http-status');
const logger = require('../logger');

// Business Models
const Message = require('../model/message');

/**
 * Message router. These are resources applied to '/message'
 */
module.exports = config => {
  router.use((ctx, next) => {
    switch (ctx.accepts('application/json')) {
      case 'application/json':
        break;
      default:
        ctx.throw(status.NOT_ACCEPTABLE);
    }

    switch (ctx.acceptsCharsets('utf-8')) {
      case 'utf-8':
        break;
      default:
        ctx.throw(status.NOT_ACCEPTABLE);
    }

    return next();
  });

  /* All routes here are JWT authenticated
   *
   * A JWT here represents a remote application
   */
  router.use(
    jwt({
      secret: fs.readFileSync(config.get('publickey'))
    })
  );

  router.use((ctx, next) => {
    if (ctx.state.user.name) {
      return next();
    }

    ctx.status = status.FORBIDDEN;
  });

  /** PUT /messages/:id
   *
   * Update an existing message
   *
   * @param {integer} text - The text of the message
   * @param {string} owner - The id of the owner in the remote system
   */
  router.put('/messages/:id', bodyParser(), ctx => {
    ctx.state.timings.startSpan('updateMessage');

    switch (ctx.is('application/json')) {
      case 'application/json':
        break;

      default:
        ctx.throw(status.NOT_ACCEPTABLE);
    }

    const messageData = ctx.request.body;
    for (const arg of ['text', 'owner']) {
      if (!messageData[arg]) {
        ctx.throw(status.BAD_REQUEST);
      }
    }
    messageData.updatedBy = ctx.state.user.name;

    const dependencies = {
      daoFac: ctx.daoFac,
      timings: ctx.state.timings
    };

    return Message.find(dependencies, ctx.params.id)
      .then(message => {
        if (!message) {
          ctx.throw(status.NOT_FOUND);
        }

        return message;
      })
      .then(message => message.update(dependencies, messageData))
      .then(() => {
        ctx.status = status.NO_CONTENT;
        ctx.state.timings.stopSpan('updateMessage');
      })
      .catch(error => {
        ctx.state.timings.stopSpan('updateMessage');

        throw error;
      });
  });

  /** POST /messages
   *
   * Create a new message
   *
   * @param {integer} text - The text of the message
   * @param {string} owner - The id of the owner in the remote system
   */
  router.post('/messages', bodyParser(), ctx => {
    ctx.state.timings.startSpan('createMessage');

    switch (ctx.is('application/json')) {
      case 'application/json':
        break;

      default:
        ctx.throw(status.NOT_ACCEPTABLE);
    }

    const messageData = ctx.request.body;

    for (const arg of ['text', 'owner']) {
      if (!messageData[arg]) {
        ctx.throw(status.BAD_REQUEST);
      }
    }

    messageData.createdBy = ctx.state.user.name;

    const message = new Message(messageData);
    return message
      .create({
        daoFac: ctx.daoFac,
        timings: ctx.state.timings
      })
      .then(message => {
        ctx.set('Location', router.url('message', message.id));
        ctx.status = status.CREATED;
        ctx.state.timings.stopSpan('createMessage');
      })
      .catch(error => {
        ctx.state.timings.stopSpan('createMessage');

        throw error;
      });
  });

  /** DELETE /messages/:id
   *
   * Delete a single message by its id
   *
   * @param {integer} id - The id of the message to be returned
   */
  router.delete('/messages/:id', ctx => {
    ctx.state.timings.startSpan('deleteMessage');

    return Message.find(
      {
        daoFac: ctx.daoFac,
        timings: ctx.state.timings
      },
      ctx.params.id
    )
      .then(message => {
        if (!message) {
          ctx.throw(status.NOT_FOUND);
        }

        return message;
      })
      .then(message => {
        return message.delete({
          daoFac: ctx.daoFac,
          timings: ctx.state.timings
        });
      })

      .then(() => {
        ctx.status = status.NO_CONTENT;
        ctx.state.timings.stopSpan('deleteMessage');
      })

      .catch(error => {
        ctx.state.timings.stopSpan('deleteMessage');

        throw error;
      });
  });

  /** GET /messages/:id
   *
   * Return a single message by its id
   *
   * @param {integer} id - The id of the message to be returned
   */
  router.get('message', '/messages/:id', ctx => {
    ctx.state.timings.startSpan('getMessage');

    return Message.find(
      {
        daoFac: ctx.daoFac,
        timings: ctx.state.timings
      },
      ctx.params.id
    )
      .then(message => {
        if (!message) {
          ctx.throw(status.NOT_FOUND);
        }

        ctx.body = {
          id: message.id,
          createdAt: message.createdAt,
          updatedAt: message.updatedAt,
          owner: message.owner,
          text: message.text
        };
        ctx.state.timings.stopSpan('getMessage');
      })
      .catch(error => {
        ctx.state.timings.stopSpan('getMessage');

        throw error;
      });
  });

  /**
   * GET /messages
   *
   * Returns all messages for a given page
   *
   * @param {integer} limit - Number of results per page (default: 10, max: 50)
   * @param {integer} page - Page of results to return
   *
   * @returns {Object} Message Resource
   */
  router.get('/messages', paginator.middleware(), ctx => {
    ctx.state.timings.startSpan('getMessages');

    const totalMessages = Message.getTotal({
      daoFac: ctx.daoFac,
      timings: ctx.state.timings
    });

    const messages = Message.getAll(
      {
        daoFac: ctx.daoFac,
        timings: ctx.state.timings
      },
      {
        offset: ctx.paginate.offset,
        limit: ctx.query.limit
      }
    );

    return Promise.filter(messages, message => message)
      .map(message => {
        return {
          id: message.id,
          createdAt: message.createdAt,
          updatedAt: message.updatedAt,
          owner: message.owner,
          text: message.text
        };
      })
      .then(async messages => {
        const pageCount = Math.ceil((await totalMessages) / ctx.query.limit);
        ctx.body = {
          messages: messages,
          page: {
            pages: paginator.getArrayPages(ctx)(3, pageCount, ctx.query.page)
          }
        };

        ctx.state.timings.stopSpan('getMessages');
      })
      .catch(error => {
        ctx.state.timings.stopSpan('getMessages');

        throw error;
      });
  });

  return router;
};
