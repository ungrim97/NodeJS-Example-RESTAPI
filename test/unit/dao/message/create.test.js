'use strict';
const assert = require('chai').assert;
const stub = require('sinon').stub;
const MessageDao = require('../../../../src/dao/message');

suite('DAO: MessageDao.create()', function() {
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

      this.store.messageStore.models.message.create = stub().resolves(
        messageData()
      );

      const messages = await this.dao.create(
        { timings: timingsStub },
        createData()
      );

      assert.ok(timingsStub.startSpan.calledOnce);
      assert.ok(timingsStub.stopSpan.calledOnce);
    });

    test('rejects', async function() {
      const timingsStub = {
        startSpan: stub(),
        stopSpan: stub()
      };

      this.store.messageStore.models.message.create = stub().rejects('error');
      await this.dao
        .create({ timings: timingsStub }, createData())
        .catch(error => {
          assert.equal(error, 'error');
        });

      assert.ok(timingsStub.startSpan.calledOnce);
      assert.ok(timingsStub.stopSpan.calledOnce);
    });
  });

  test('No text', function() {
    this.store.messageStore.models.message.create = stub().resolves();

    const data = createData();
    data.text = undefined;

    assert.throws(() => {
      this.dao.create({}, data);
    }, '`text` is a required argument to MessageDao.create()');

    assert.notOk(this.store.messageStore.models.message.create.called);
  });

  test('No owner', function() {
    this.store.messageStore.models.message.create = stub().resolves();

    const data = createData();
    data.owner = undefined;

    assert.throws(() => {
      this.dao.create({}, data);
    }, '`owner` is a required argument to MessageDao.create()');

    assert.notOk(this.store.messageStore.models.message.create.called);
  });

  test('No createdBy', function() {
    this.store.messageStore.models.message.create = stub().resolves();

    const data = createData();
    data.createdBy = undefined;

    assert.throws(() => {
      this.dao.create({}, data);
    }, '`createdBy` is a required argument to MessageDao.create()');

    assert.notOk(this.store.messageStore.models.message.create.called);
  });

  test('No Data', async function() {
    this.store.messageStore.models.message.create = stub().resolves();

    const messages = await this.dao.create({}, createData());
    assert.deepEqual(messages, undefined);
  });

  test('Data Returns', async function() {
    this.store.messageStore.models.message.create = stub().resolves(
      messageData()
    );

    const messages = await this.dao.create({}, createData());
    assert.deepEqual(messages, messageData());
  });
});

function createData() {
  return {
    text: 'test',
    owner: '1',
    createdBy: 'testUser'
  };
}

function messageData() {
  return {
    id: 1,
    text: 'test',
    owner: '1',
    createdAt: '2019-01-01T00:00:00.000Z',
    updatedAt: '2019-01-01T00:00:00.000Z',
    updatedBy: 'testUser',
    createdBy: 'testUser'
  };
}
