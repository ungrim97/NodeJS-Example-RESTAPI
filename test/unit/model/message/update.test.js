'use strict';
const assert = require('chai').assert;
const Promise = require('bluebird');
const stub = require('sinon').stub;
const Message = require('../../../../src/model/message');

suite('Model: Message.update()', function() {
  setup(function() {
    this.message = new Message(messageData());
  });

  suite('timings', function() {
    test('Resolves', async function() {
      const timingsStub = {
        startSpan: stub(),
        stopSpan: stub()
      };

      const messages = await this.message.update(
        {
          timings: timingsStub,
          daoFac: {
            daoFor: stub()
              .usingPromise(Promise)
              .resolves({
                update: stub()
                  .usingPromise(Promise)
                  .resolves(Object.assign(messageData(), updateData))
              })
          }
        },
        updateData()
      );

      assert.ok(timingsStub.startSpan.calledOnce);
      assert.ok(timingsStub.stopSpan.calledOnce);
    });

    test('Rejects', async function() {
      const timingsStub = {
        startSpan: stub(),
        stopSpan: stub()
      };

      await this.message
        .update(
          {
            timings: timingsStub,
            daoFac: {
              daoFor: stub()
                .usingPromise(Promise)
                .resolves({
                  update: stub()
                    .usingPromise(Promise)
                    .rejects('error')
                })
            }
          },
          updateData()
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
      this.message.update({}, 1);
    }, '`deps.daoFac` is a required argument to message.update()');
  });

  test('No id', function() {
    assert.throws(() => {
      this.message.id = undefined;
      this.message.update(
        {
          daoFac: {
            daoFor: stub()
              .usingPromise(Promise)
              .resolves({
                update: stub()
                  .usingPromise(Promise)
                  .resolves(null)
              })
          }
        },
        updateData()
      );
    }, '`this.id` is a required argument to message.update()');
  });

  test('No input', function() {
    assert.throws(() => {
      this.message.update({
        daoFac: {
          daoFor: stub()
            .usingPromise(Promise)
            .resolves({
              update: stub()
                .usingPromise(Promise)
                .resolves(null)
            })
        }
      });
    }, 'message.update() expects at least `text` or `owner`');
  });

  test('No Data Returned', async function() {
    const updateStub = stub()
      .usingPromise(Promise)
      .resolves();

    const daoStub = stub()
      .usingPromise(Promise)
      .resolves({
        update: updateStub
      });

    await this.message
      .update(
        {
          daoFac: {
            daoFor: daoStub
          }
        },
        updateData()
      )
      .catch(error => {
        assert.equal(error, 'Error: Failure to retrieve newly updated message');
      });

    assert.ok(
      updateStub.calledWith(
        { daoFac: { daoFor: daoStub } },
        this.message.id,
        updateData()
      )
    );
  });

  test('Data Returns', async function() {
    const updateStub = stub()
      .usingPromise(Promise)
      .resolves(Object.assign(messageData(), updateData));

    const daoStub = stub()
      .usingPromise(Promise)
      .resolves({
        update: updateStub
      });

    const messages = await this.message.update(
      {
        daoFac: {
          daoFor: daoStub
        }
      },
      updateData()
    );

    assert.ok(
      updateStub.calledWith(
        { daoFac: { daoFor: daoStub } },
        this.message.id,
        updateData()
      )
    );

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
    createdAt: '2019-01-01T00:00:00.000Z',
    updatedAt: '2019-01-01T00:00:00.000Z',
    createdBy: 'testUser',
    updatedBy: 'testUser'
  };
}
