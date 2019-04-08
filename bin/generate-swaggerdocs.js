'use strict';
const swaggerJSDoc = require('swagger-jsdoc');
const fs = require('fs');
const YAML = require('yaml');

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
fs.writeFile(
  __dirname + '/../api-docs/openapi.yml',
  '---\n' + YAML.stringify(swaggerSpec),
  error => {
    if (error) {
      console.error(error);
    }

    console.log('Generated api-docs/openapi.yml');
  }
);
fs.writeFile(
  __dirname + '/../api-docs/openapi.json',
  JSON.stringify(swaggerSpec, null, 2),
  error => {
    if (error) {
      console.error(error);
    }

    console.log('Generated api-docs/openapi.json');
  }
);
