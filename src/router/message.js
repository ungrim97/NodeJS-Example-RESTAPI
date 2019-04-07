const fs = require('fs');
const jwt = require('koa-jwt');
const paginator = require('koa-ctx-paginate');
const Promise = require('bluebird');
const router = require('koa-router')();

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
        ctx.throw(406);
    }

    return next();
  });

  /* All routes here are JWT authenticated */
  router.use(
    jwt({
      secret: fs.readFileSync(config.get('publickey'))
    })
  );

  router.use(paginator.middleware());

  /** GET /messages/:id
   *
   * Return a single message by its id
   *
   * @param {integer} id - The id of the message to be returned
   */
  router.get('/messages/:id', ctx => {
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
          ctx.throw(404);
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
  router.get('/messages', ctx => {
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
        pageCount = Math.ceil((await totalMessages) / ctx.query.limit);
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
