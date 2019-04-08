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
 *
 * @param {Object} config - Application config
 * @returns {Object} router - Koa Router instance
 */
/**
 * @swagger
 * components:
 *   responses:
 *     NotFound:
 *       description: Message not found
 *     NoContent:
 *       description: Action successful
 *     Created:
 *       description: Item created
 *     BadRequest:
 *       description: Input parameters messing
 *   schemas:
 *     Message:
 *       type: object
 *       required:
 *         - text
 *         - owner
 *       properties:
 *         id:
 *           type: integer
 *           description: Identifier of Message
 *           example: 1
 *         text:
 *           type: string
 *           description: Message text
 *           example: 'this is a message'
 *         owner:
 *           type: owner
 *           description: Id of message owner in remote system
 *           example: '123123'
 *         createdAt:
 *           type: string
 *           description: Time Message was created
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           description: Time message was last updated
 *           format: date-time
 *         createdBy:
 *           description: Name of the system that created the message
 *           type: string
 *         updatedBy:
 *           description: Name of the system that last updated the message
 *           type: string
 *     Pages:
 *       description: Available page links
 *       properties:
 *         number:
 *           type: integer
 *           description: Number of the page
 *           example: 1
 *         url:
 *           type: string
 *           description: URL to retrieve a page
 *           example: "/messages?page=1&limit=10"
 */
module.exports = config => {
  /** 406 unless Accepts: application/json */
  /**
   * @swagger
   * components:
   *   responses:
   *     NotAcceptable:
   *       description: invalid Accepts/Accepts-Charset/Content-type
   */
  router.use((ctx, next) => {
    switch (ctx.accepts('application/json')) {
      case 'application/json':
        break;
      default:
        ctx.throw(status.NOT_ACCEPTABLE);
    }

    /** 406 unless Accepts-charset: utf-8 */
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
   *
   * 401 if JWT invalid
   */
  /**
   * @swagger
   * components:
   *   securitySchemes:
   *     bearerAuth:
   *       type: http
   *       scheme: bearer
   *       bearerFormat: JWT
   *   responses:
   *     Unauthorized:
   *       description: JWT Invalid or missing
   */
  router.use(
    jwt({
      secret: fs.readFileSync(config.get('publickey'))
    })
  );

  /** 403 unless JWT has a "name" key for the user */
  /**
   * @swagger
   * components:
   *   responses:
   *     Forbidden:
   *       description: JWT payload does not include a name
   */
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
  /**
   * @swagger
   * /messages/{id}:
   *   put:
   *     tags:
   *       - Message Item
   *     description: Updated an existing message
   *     produces: application/json
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           $ref: '#/components/schemas/Message/properties/id'
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               text:
   *                 required: true
   *                 schema:
   *                   $ref: '#/components/schemas/Message/properties/text'
   *               owner:
   *                 required: true
   *                 schema:
   *                   $ref: '#/components/schemas/Message/properties/owner'
   *             example:
   *               text: 'This is a test message'
   *               owner: '12234'
   *     responses:
   *       '204':
   *         $ref: '#/components/responses/NoContent'
   *       '400':
   *         $ref: '#/components/responses/BadRequest'
   *       '404':
   *         $ref: '#/components/responses/NotFound'
   *       '401':
   *         $ref: '#/components/responses/Unauthorized'
   *       '403':
   *         $ref: '#/components/responses/Forbidden'
   *     security:
   *       - bearerAuth: []
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
   * 201 Created
   * Location header set to created message
   *
   * @param {integer} text - The text of the message
   * @param {string} owner - The id of the owner in the remote system
   */
  /**
   * @swagger
   * /messages:
   *   post:
   *     tags:
   *       - Messages Collection
   *     description: Create a message
   *     produces: application/json
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               text:
   *                 required: true
   *                 schema:
   *                   $ref: '#/components/schemas/Message/properties/text'
   *               owner:
   *                 required: true
   *                 schema:
   *                   $ref: '#/components/schemas/Message/properties/owner'
   *             example:
   *               text: 'This is a test message'
   *               owner: '12234'
   *     responses:
   *       '201':
   *         $ref: '#/components/responses/Created'
   *       '400':
   *         $ref: '#/components/responses/BadRequest'
   *       '401':
   *         $ref: '#/components/responses/Unauthorized'
   *       '403':
   *         $ref: '#/components/responses/Forbidden'
   *     security:
   *       - bearerAuth: []
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
   * 204 No Content
   *
   * @param {integer} id - The id of the message to be returned
   */
  /**
   * @swagger
   * /messages/{id}:
   *   delete:
   *     tags:
   *       - Message Item
   *     description: Delete a message
   *     produces: application/json
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           $ref: '#/components/schemas/Message/properties/id'
   *     responses:
   *       '204':
   *         $ref: '#/components/responses/NoContent'
   *       '404':
   *         $ref: '#/components/responses/NotFound'
   *       '401':
   *         $ref: '#/components/responses/Unauthorized'
   *       '403':
   *         $ref: '#/components/responses/Forbidden'
   *     security:
   *       - bearerAuth: []
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
   * 200 OK
   *
   * {
   *    "text": "text of the message",
   *    "owner": "owner if in the remote system",
   *    "createdAt": "RFC-3339 format datetime string at which the message was created"
   *    "updatedAt": "RFC-3339 format datetime string at which the message was updated",
   *    "createdBy": "remote system that created the message",
   *    "updatedBy": "remote system that updated the message",
   * }
   *
   * @param {integer} id - The id of the message to be returned
   */
  /**
   * @swagger
   * /messages/{id}:
   *   get:
   *     tags:
   *       - Message Item
   *     description: Retrieve a message
   *     produces: application/json
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           $ref: '#/components/schemas/Message/properties/id'
   *     responses:
   *       '200':
   *         description: Item retrieved
   *         schema:
   *           $ref: '#/components/schemas/Message'
   *       '404':
   *         $ref: '#/components/responses/NotFound'
   *       '401':
   *         $ref: '#/components/responses/Unauthorized'
   *       '403':
   *         $ref: '#/components/responses/Forbidden'
   *     security:
   *       - bearerAuth: []
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
   * {
   *   "messages": [{
   *     "text": "text of the message",
   *     "owner": "owner if in the remote system",
   *     "createdAt": "RFC-3339 format datetime string at which the message was created"
   *     "updatedAt": "RFC-3339 format datetime string at which the message was updated",
   *     "createdBy": "remote system that created the message",
   *     "updatedBy": "remote system that updated the message",
   *   }],
   *   "page": {
   *     "pages": [{
   *       "number":1, "url":"/messages?page=1&limit=10"
   *     }]
   *   }
   * }
   *
   * @param {integer} limit - Number of results per page (default: 10, max: 50)
   * @param {integer} page - Page of results to return
   *
   * @returns {Object} Message Resource
   */
  /**
   * @swagger
   * /messages:
   *   get:
   *     tags:
   *       - Messages Collection
   *     description: Retrieve messages
   *     produces: application/json
   *     parameters:
   *       - name: page
   *         in: query
   *         schema:
   *           type: integer
   *           example: 1
   *           default: 1
   *           minimum: 1
   *       - name: limit
   *         in: query
   *         schema:
   *           type: integer
   *           example: 50
   *           maximum: 100
   *           default: 0
   *           minimum: 1
   *     responses:
   *       '200':
   *         description: Collection retrieved
   *         schema:
   *           content:
   *             type: object
   *             properties:
   *               messages:
   *                 type: array
   *                 schema:
   *                   $ref: '#/components/schemas/Message'
   *               page:
   *                 type: object
   *                 properties:
   *                   pages:
   *                     type: array
   *                     schema:
   *                       i$ref: '#/components/schemas/pages'
   *       '404':
   *         $ref: '#/components/responses/NotFound'
   *       '401':
   *         $ref: '#/components/responses/Unauthorized'
   *       '403':
   *         $ref: '#/components/responses/Forbidden'
   *     security:
   *       - bearerAuth: []
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
