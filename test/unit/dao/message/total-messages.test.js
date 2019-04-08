'use strict';
const assert = require('chai').assert;
const stub = require('sinon').stub;

const MessageDao = require('../../../../src/dao/message');

suite('DAO: MessageDao.totalMessages()', function() {
  setup(function() {
    this.store = {
      messageStore: {
        models: {
          message: {}
        }
      }
    };

    this.dao = new MessageDao(this.store);
  });

  suite('timings', function() {
    test('Resolves', async function() {
      const timingsStub = {
        startSpan: stub(),
        stopSpan: stub()
      };

      this.store.messageStore.models.message.count = stub().resolves(5);
      const messages = await this.dao.totalMessages(
        {
          timings: timingsStub
        },
        {}
      );

      assert.ok(timingsStub.startSpan.calledOnce);
      assert.ok(timingsStub.stopSpan.calledOnce);
    });

    test('Rejects', async function() {
      const timingsStub = {
        startSpan: stub(),
        stopSpan: stub()
      };

      this.store.messageStore.models.message.count = stub().rejects('error');
      await this.dao
        .totalMessages(
          {
            timings: timingsStub
          },
          {}
        )
        .catch(error => {
          assert.equal(error, 'error');
        });

      assert.ok(timingsStub.startSpan.calledOnce);
      assert.ok(timingsStub.stopSpan.calledOnce);
    });
  });

  test('Count Returns', async function() {
    this.store.messageStore.models.message.count = stub().resolves(5);
    const count = await this.dao.totalMessages({});

    assert.equal(count, 5);
  });
});
