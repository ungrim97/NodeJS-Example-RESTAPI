#!/usr/bin/env node
'use strict';
//module dependencies
const config = require('config');
const Server = require('../src/server');
const http = require('http');

//create http server
const httpPort = normalizePort(config.get('port'));

const app = Server.bootstrap(config).app;
const httpServer = http.createServer(app.callback());

//add error handler
httpServer.on('error', onError);

//start listening on port
httpServer.on('listening', onListening);

//listen on provided ports
httpServer.listen(httpPort);

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server 'error' event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind =
    typeof httpPort === 'string' ? 'Pipe ' + httpPort : 'Port ' + httpPort;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server 'listening' event.
 */
function onListening() {
  const addr = httpServer.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}
