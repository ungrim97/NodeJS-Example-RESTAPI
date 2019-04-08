'use strict';
const assert = require('chai').assert;
const Promise = require('bluebird');
const stub = require('sinon').stub;

const Message = require('../../../../src/model/message');

suite('Model: Message.getAll()', function() {
  suite('timings', function() {
    test('Resolves', async function() {
      const timingsStub = {
        startSpan: stub(),
        stopSpan: stub()
      };

      const messages = await Message.getAll(
        {
          timings: timingsStub,
          daoFac: {
            daoFor: stub()
              .usingPromise(Promise)
              .resolves({
                getAll: stub()
                  .usingPromise(Promise)
                  .resolves(messageData())
              })
          }
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

      await Message.getAll(
        {
          timings: timingsStub,
          daoFac: {
            daoFor: stub()
              .usingPromise(Promise)
              .resolves({
                getAll: stub()
                  .usingPromise(Promise)
                  .rejects('error')
              })
          }
        },
        {}
      ).catch(error => {
        assert.equal(error, 'error');
      });

      assert.ok(timingsStub.startSpan.calledOnce);
      assert.ok(timingsStub.stopSpan.calledOnce);
    });
  });

  test('No Dao', function() {
    assert.throws(() => {
      Message.getAll({});
    }, '`deps.daoFac` is a required argument to Message.getAll()');
  });

  test('No Data', async function() {
    const messages = await Message.getAll(
      {
        daoFac: {
          daoFor: stub()
            .usingPromise(Promise)
            .resolves({
              getAll: stub()
                .usingPromise(Promise)
                .resolves([])
            })
        }
      },
      {}
    );

    assert.deepEqual(messages, []);
  });

  suite('Data Returns', function() {
    test('No Limit', async function() {
      const daoStub = stub()
        .usingPromise(Promise)
        .resolves(messageData());

      const messages = await Message.getAll(
        {
          daoFac: {
            daoFor: stub()
              .usingPromise(Promise)
              .resolves({
                getAll: daoStub
              })
          }
        },
        {}
      );

      assert.ok(daoStub.calledWith);
      assert.deepEqual(messages, messageData());
    });
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
