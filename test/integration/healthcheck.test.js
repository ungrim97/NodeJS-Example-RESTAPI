'use strict';
const assert = require('chai').assert;
const config = require('config');
const request = require('supertest');
const status = require('http-status');

const Server = require('../../src/server');
const server = Server.bootstrap(config);
const app = server.app.callback();

suite('/healthcheck', function() {
  test('GET', function() {
    return request(app)
      .get('/healthcheck')
      .set('Accept', 'application/json')
      .then(res => {
        assert.equal(res.status, status.OK);
        assert.deepEqual(res.body, {
          status: 'ok',
          version: config.get('version')
        });
      });
  });
});
