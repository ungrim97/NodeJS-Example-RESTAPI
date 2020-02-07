'use strict';
const assert = require('chai').assert;
const Promise = require('bluebird');
const stub = require('sinon').stub;

const Message = require('../../../../src/model/message');

suite('Model: Message.find()', function() {
  suite('timings', function() {
    test('Resolves', async function() {
      const timingsStub = {
        startSpan: stub(),
        stopSpan: stub()
      };

      const messages = await Message.find(
        {
          timings: timingsStub,
          daoFac: {
            daoFor: stub().returns({
              find: stub()
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

      await Message.find(
        {
          timings: timingsStub,
          daoFac: {
            daoFor: stub().returns({
              find: stub()
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
      Message.find({}, 1);
    }, '`deps.daoFac` is a required argument to Message.find()');
  });

  test('No id', function() {
    assert.throws(() => {
      Message.find({
        daoFac: {
          daoFor: stub().returns({
            find: stub()
              .usingPromise(Promise)
              .resolves(null)
          })
        }
      });
    }, '`id` is a required argument to Message.find()');
  });

  test('No Data', async function() {
    const messages = await Message.find(
      {
        daoFac: {
          daoFor: stub().returns({
            find: stub()
              .usingPromise(Promise)
              .resolves(null)
          })
        }
      },
      3
    );

    assert.deepEqual(messages, undefined);
  });

  test('Data Returns', async function() {
    const messages = await Message.find(
      {
        daoFac: {
          daoFor: stub().returns({
            find: stub()
              .usingPromise(Promise)
              .resolves(messageData())
          })
        }
      },
      1
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
