const assert = require('chai').assert;
const stub = require('sinon').stub;

const MessageDao = require('../../../../src/dao/message');

suite('DAO: MessageDao.delete()', function() {
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

      this.store.messageStore.models.message.destroy = stub().resolves(
        messageData()
      );
      const messages = await this.dao.delete({ timings: timingsStub }, 1);

      assert.ok(timingsStub.startSpan.calledOnce);
      assert.ok(timingsStub.stopSpan.calledOnce);
    });

    test('rejects', async function() {
      const timingsStub = {
        startSpan: stub(),
        stopSpan: stub()
      };

      this.store.messageStore.models.message.destroy = stub().rejects('error');
      await this.dao
        .delete({ timings: timingsStub }, 87687686876)
        .catch(error => {
          assert.equal(error, 'error');
        });

      assert.ok(timingsStub.startSpan.calledOnce);
      assert.ok(timingsStub.stopSpan.calledOnce);
    });
  });

  test('No Id', function() {
    this.store.messageStore.models.message.destroy = stub().resolves();
    assert.throws(() => {
      this.dao.delete();
    }, '`id` is a required argument to MessageDao.delete()');
    assert.notOk(this.store.messageStore.models.message.destroy.called);
  });

  test('Data Returns', async function() {
    this.store.messageStore.models.message.destroy = stub().resolves(
      messageData()
    );
    const messages = await this.dao.delete({}, 1);

    assert.ok(
      this.store.messageStore.models.message.destroy.calledWith({
        where: { id: 1 }
      })
    );
    assert.deepEqual(messages, messageData());
  });
});

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
