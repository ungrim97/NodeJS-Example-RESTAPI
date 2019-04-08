'use strict';
const swaggerJSDoc = require('swagger-jsdoc');

const baseRouter = __dirname + '/../src/router/base.js';
const messageRouter = __dirname + '/../src/router/message.js';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'NodeJs Example RESTAPI',
      version: '1.0.0'
    }
  },
  // Path to the API docs
  apis: [baseRouter, messageRouter]
};

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
const swaggerSpec = swaggerJSDoc(options);
console.log(swaggerSpec);
