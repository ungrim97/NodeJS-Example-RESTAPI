const assert = require('chai').assert;
const Promise = require('bluebird');
const stub = require('sinon').stub;

const Message = require('../../../../src/model/message');

suite('Model: Message.getTotal()', function() {
  suite('timings', function() {
    test('Resolves', async function() {
      const timingsStub = {
        startSpan: stub(),
        stopSpan: stub()
      };

      const messages = await Message.getTotal(
        {
          timings: timingsStub,
          daoFac: {
            daoFor: stub()
              .usingPromise(Promise)
              .resolves({
                totalMessages: stub()
                  .usingPromise(Promise)
                  .resolves(5)
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

      await Message.getTotal(
        {
          timings: timingsStub,
          daoFac: {
            daoFor: stub()
              .usingPromise(Promise)
              .resolves({
                totalMessages: stub()
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
      Message.getTotal({});
    }, '`deps.daoFac` is a required argument to Message.getTotal()');
  });

  test('Count Returns', async function() {
    const count = await Message.getTotal(
      {
        daoFac: {
          daoFor: stub()
            .usingPromise(Promise)
            .resolves({
              totalMessages: stub()
                .usingPromise(Promise)
                .resolves(5)
            })
        }
      },
      {}
    );

    assert.equal(count, 5);
  });
});
