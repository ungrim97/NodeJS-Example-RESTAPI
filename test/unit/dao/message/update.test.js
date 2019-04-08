'use strict';
const assert = require('chai').assert;
const stub = require('sinon').stub;
const MessageDao = require('../../../../src/dao/message');

suite('DAO: MessageDao.update()', function() {
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
    test('resolves', async function() {
      const timingsStub = {
        startSpan: stub(),
        stopSpan: stub()
      };

      this.store.messageStore.models.message.update = stub().resolves(
        messageData()
      );

      const messages = await this.dao.update(
        { timings: timingsStub },
        1,
        updateData()
      );

      assert.ok(timingsStub.startSpan.calledOnce);
      assert.ok(timingsStub.stopSpan.calledOnce);
    });

    test('rejects', async function() {
      const timingsStub = {
        startSpan: stub(),
        stopSpan: stub()
      };

      this.store.messageStore.models.message.update = stub().rejects('error');
      await this.dao
        .update({ timings: timingsStub }, 1, updateData())
        .catch(error => {
          assert.equal(error, 'error');
        });

      assert.ok(timingsStub.startSpan.calledOnce);
      assert.ok(timingsStub.stopSpan.calledOnce);
    });
  });

  test('No input data', function() {
    this.store.messageStore.models.message.update = stub().resolves();

    const data = updateData();
    data.text = undefined;
    data.owner = undefined;

    assert.throws(() => {
      this.dao.update({}, 1, data);
    }, 'MessageDao.update() expects `text` and/or `owner` arguments');

    assert.notOk(this.store.messageStore.models.message.update.called);
  });

  test('No updatedBy', function() {
    this.store.messageStore.models.message.update = stub().resolves();

    const data = updateData();
    data.updatedBy = undefined;

    assert.throws(() => {
      this.dao.update({}, 1, data);
    }, '`updatedBy` is a required argument to MessageDao.update()');

    assert.notOk(this.store.messageStore.models.message.update.called);
  });

  test('No Id', function() {
    this.store.messageStore.models.message.update = stub().resolves();
    assert.throws(() => {
      this.dao.update({}, null, updateData());
    }, '`id` is a required argument to MessageDao.update()');

    assert.notOk(this.store.messageStore.models.message.update.called);
  });

  test('No return Data', async function() {
    this.store.messageStore.models.message.update = stub().resolves();

    const messages = await this.dao.update({}, 1, updateData());
    assert.deepEqual(messages, undefined);
  });

  test('Data Returns', async function() {
    this.store.messageStore.models.message.update = stub().resolves(
      messageData()
    );

    const messages = await this.dao.update({}, 1, updateData());
    assert.deepEqual(messages, messageData());
  });
});

function updateData() {
  return {
    text: 'test',
    owner: '1',
    updatedBy: 'testUser'
  };
}

function messageData() {
  return {
    id: 1,
    text: 'test',
    owner: '1',
    updatedAt: '2019-01-01T00:00:00.000Z',
    createdAt: '2019-01-01T00:00:00.000Z',
    updatedBy: 'testUser',
    createdBy: 'testUser'
  };
}
