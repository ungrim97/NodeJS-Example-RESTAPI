'use strict';
const assert = require('chai').assert;
const config = require('config');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const request = require('supertest');
const status = require('http-status');

const Server = require('../../src/server');
const server = Server.bootstrap(config);
const app = server.app.callback();

const fixtures = require('./fixtures');
const Store = require('../../src/store');
const store = new Store(config.get('store'));

suite('/messages/:id', function() {
  suiteSetup(async function() {
    this.authToken = jwt.sign(
      { name: 'testUser' },
      fs.readFileSync('test/auth-private.key'),
      { algorithm: 'ES256' }
    );
  });
  setup(async function() {
    await fixtures.populate(store);
  });
  teardown(function() {
    fixtures.depopulate(store);
  });

  suite('PUT', function() {
    suite('BAD REQUEST', function() {
      test('missing text', function() {
        return request(app)
          .put('/messages/1')
          .set('Accept', 'application/json')
          .set('Content-type', 'application/json')
          .set('Authorization', 'Bearer ' + this.authToken)
          .send({
            owner: '2'
          })
          .then(res => {
            assert.equal(res.status, status.BAD_REQUEST);
          });
      });
      test('missing owner', function() {
        return request(app)
          .put('/messages/1')
          .set('Accept', 'application/json')
          .set('Content-type', 'application/json')
          .set('Authorization', 'Bearer ' + this.authToken)
          .send({
            text: 'This is another test 📙 updated'
          })
          .then(res => {
            assert.equal(res.status, status.BAD_REQUEST);
          });
      });
    });
    test('NO CONTENT', async function() {
      await store.messageStore.models.message.findByPk(1).then(message => {
        assert.ok(message);
        // Ensure fixture data we are testing against is as expected
        assert.equal(
          message.updatedAt.toISOString(),
          '2019-01-01T00:00:00.000Z'
        );
      });

      return request(app)
        .put('/messages/1')
        .set('Accept', 'application/json')
        .set('Content-type', 'application/json')
        .set('Authorization', 'Bearer ' + this.authToken)
        .send({
          text: 'This is another test 📙 updated',
          owner: '2'
        })
        .then(res => {
          assert.equal(res.status, status.NO_CONTENT);
        })
        .then(() => {
          // Check db is changed
          store.messageStore.models.message.findByPk(1).then(message => {
            assert.equal(message.text, 'This is another test 📙 updated');
            assert.notEqual(message.updatedAt, '2019-01-01T00:00:00.000Z');
          });
        });
    });
  });

  suite('DELETE', function() {
    test('NO CONTENT', function() {
      return request(app)
        .delete('/messages/1')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + this.authToken)
        .then(res => {
          assert.equal(res.status, status.NO_CONTENT);
        })
        .then(() => {
          // Check db is changed
          store.messageStore.models.message
            .count()
            .then(total => assert.equal(total, 1));
        });
    });

    test('Not Found', function() {
      return request(app)
        .delete('/messages/7826722')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + this.authToken)
        .then(res => {
          assert.ok(res.status, status.NOT_FOUND);
        });
    });
  });

  suite('GET', function() {
    test('OK', function() {
      return request(app)
        .get('/messages/1')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + this.authToken)
        .then(res => {
          assert.equal(res.status, status.OK);
          assert.deepEqual(res.body, {
            id: 1,
            text: 'This is a test 📙',
            owner: '1',
            createdAt: '2019-01-01T00:00:00.000Z',
            updatedAt: '2019-01-01T00:00:00.000Z'
          });
        });
    });
    test('Not Found', function() {
      return request(app)
        .get('/messages/7826722')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + this.authToken)
        .then(res => {
          assert.ok(res.status, status.NOT_FOUND);
        });
    });
  });
});

suite('/messages', function() {
  suiteSetup(async function() {
    this.authToken = jwt.sign(
      { name: 'testUser' },
      fs.readFileSync('test/auth-private.key'),
      { algorithm: 'ES256' }
    );
  });
  setup(async function() {
    await fixtures.populate(store);
  });
  teardown(function() {
    fixtures.depopulate(store);
  });

  suite('GET', function() {
    test('default pages', function() {
      return request(app)
        .get('/messages')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + this.authToken)
        .then(res => {
          assert.equal(res.status, status.OK);
          assert.deepEqual(res.body.messages, [
            {
              id: 1,
              text: 'This is a test 📙',
              owner: '1',
              createdAt: '2019-01-01T00:00:00.000Z',
              updatedAt: '2019-01-01T00:00:00.000Z'
            },
            {
              id: 2,
              text: 'This is another test 📙',
              owner: '2',
              createdAt: '2019-01-01T00:00:00.000Z',
              updatedAt: '2019-01-01T00:00:00.000Z'
            }
          ]);
        });
    });

    test('limit=1&page=2', function() {
      return request(app)
        .get('/messages?page=2&limit=1')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + this.authToken)
        .then(res => {
          assert.equal(res.status, status.OK);
          assert.deepEqual(res.body.messages, [
            {
              id: 2,
              text: 'This is another test 📙',
              owner: '2',
              createdAt: '2019-01-01T00:00:00.000Z',
              updatedAt: '2019-01-01T00:00:00.000Z'
            }
          ]);
        });
    });
  });

  suite('POST', function() {
    test('CREATED', function() {
      return request(app)
        .post('/messages')
        .set('Accept', 'application/json')
        .set('Content-type', 'application/json')
        .set('Authorization', 'Bearer ' + this.authToken)
        .send({
          text: 'This is another test 📙',
          owner: '2'
        })
        .then(res => {
          assert.equal(res.status, status.CREATED);
          assert.equal(res.headers['location'], '/messages/3');
        })
        .then(() => {
          // Check db is changed
          store.messageStore.models.message
            .count()
            .then(total => assert.equal(total, 3));
        });
    });
  });
});
