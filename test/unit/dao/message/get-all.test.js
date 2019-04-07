const assert = require('chai').assert;
const stub = require('sinon').stub;

const MessageDao = require('../../../../src/dao/message');

suite('DAO: MessageDao.getAll()', function() {
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

      this.store.messageStore.models.message.findAll = stub().resolves([]);
      const messages = await this.dao.getAll({
        timings: timingsStub
      });

      assert.ok(timingsStub.startSpan.calledOnce);
      assert.ok(timingsStub.stopSpan.calledOnce);
    });

    test('rejects', async function() {
      const timingsStub = {
        startSpan: stub(),
        stopSpan: stub()
      };

      this.store.messageStore.models.message.findAll = stub().rejects('error');
      await this.dao
        .getAll({
          timings: timingsStub
        })
        .catch(error => {
          assert.equal(error, 'error');
        });

      assert.ok(timingsStub.startSpan.calledOnce);
      assert.ok(timingsStub.stopSpan.calledOnce);
    });
  });

  test('No Data', async function() {
    this.store.messageStore.models.message.findAll = stub().resolves([]);
    const messages = await this.dao.getAll();

    assert.deepEqual(messages, []);
  });

  test('Data Returns', async function() {
    this.store.messageStore.models.message.findAll = stub().resolves(
      messageData()
    );
    const messages = await this.dao.getAll();

    assert.deepEqual(messages, messageData());
  });
});

function messageData() {
  return [
    {
      id: 1,
      text: 'test',
      owner: '1',
      createdAt: '2019-01-01T00:00:00.000Z',
      updatedAt: '2019-01-01T00:00:00.000Z',
      updatedBy: 'testUser',
      createdBy: 'testUser'
    },
    {
      id: 2,
      text: 'test',
      owner: '1',
      createdAt: '2019-01-01T00:00:00.000Z',
      updatedAt: '2019-01-01T00:00:00.000Z',
      updatedBy: 'testUser',
      createdBy: 'testUser'
    },
    {
      id: 3,
      text: 'test',
      owner: '1',
      createdAt: '2019-01-01T00:00:00.000Z',
      updatedAt: '2019-01-01T00:00:00.000Z',
      updatedBy: 'testUser',
      createdBy: 'testUser'
    },
    {
      id: 4,
      text: 'test',
      owner: '1',
      createdAt: '2019-01-01T00:00:00.000Z',
      updatedAt: '2019-01-01T00:00:00.000Z',
      updatedBy: 'testUser',
      createdBy: 'testUser'
    },
    {
      id: 5,
      text: 'test',
      owner: '1',
      createdAt: '2019-01-01T00:00:00.000Z',
      updatedAt: '2019-01-01T00:00:00.000Z',
      updatedBy: 'testUser',
      createdBy: 'testUser'
    }
  ];
}
