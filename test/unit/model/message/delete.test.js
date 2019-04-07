const assert = require('chai').assert;
const Promise = require('bluebird');
const stub = require('sinon').stub;

const Message = require('../../../../src/model/message');

suite('Model: Message.delete()', function() {
  setup(function() {
    this.message = new Message(messageData());
  });
  suite('timings', function() {
    test('Resolves', async function() {
      const timingsStub = {
        startSpan: stub(),
        stopSpan: stub()
      };

      const messages = await this.message.delete({
        timings: timingsStub,
        daoFac: {
          daoFor: stub()
            .usingPromise(Promise)
            .resolves({
              delete: stub()
                .usingPromise(Promise)
                .resolves(messageData())
            })
        }
      });

      assert.ok(timingsStub.startSpan.calledOnce);
      assert.ok(timingsStub.stopSpan.calledOnce);
    });

    test('Rejects', async function() {
      const timingsStub = {
        startSpan: stub(),
        stopSpan: stub()
      };

      await this.message
        .delete(
          {
            timings: timingsStub,
            daoFac: {
              daoFor: stub()
                .usingPromise(Promise)
                .resolves({
                  delete: stub()
                    .usingPromise(Promise)
                    .rejects('error')
                })
            }
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

  test('No Dao', function() {
    assert.throws(() => {
      this.message.delete({}, 1);
    }, '`deps.daoFac` is a required argument to message.delete()');
  });

  test('No id', function() {
    assert.throws(() => {
      this.message.id = undefined;
      this.message.delete({
        daoFac: {
          daoFor: stub()
            .usingPromise(Promise)
            .resolves({
              delete: stub()
                .usingPromise(Promise)
                .resolves(null)
            })
        }
      });
    }, '`this.id` is a required argument to message.delete()');
  });

  test('No Data Returned', async function() {
    const deleteStub = stub()
      .usingPromise(Promise)
      .resolves();
    const daoStub = stub()
      .usingPromise(Promise)
      .resolves({
        delete: deleteStub
      });

    const messages = await this.message.delete({
      daoFac: {
        daoFor: daoStub
      }
    });

    assert.ok(deleteStub.calledWith({ daoFac: { daoFor: daoStub } }, 1));
    assert.deepEqual(messages, undefined);
  });

  test('Data Returns', async function() {
    const deleteStub = stub()
      .usingPromise(Promise)
      .resolves(messageData());
    const daoStub = stub()
      .usingPromise(Promise)
      .resolves({
        delete: deleteStub
      });

    const messages = await this.message.delete({
      daoFac: {
        daoFor: daoStub
      }
    });

    assert.ok(deleteStub.calledWith({ daoFac: { daoFor: daoStub } }, 1));
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
