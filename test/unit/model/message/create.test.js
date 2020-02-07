'use strict';
const assert = require('chai').assert;
const Promise = require('bluebird');
const stub = require('sinon').stub;
const Message = require('../../../../src/model/message');

suite('Model: Message.create()', function() {
  setup(function() {
    this.message = new Message(createData());
  });

  suite('timings', function() {
    test('Resolves', async function() {
      const timingsStub = {
        startSpan: stub(),
        stopSpan: stub()
      };

      const messages = await this.message.create({
        timings: timingsStub,
        daoFac: {
          daoFor: stub().returns({
            create: stub()
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
        .create(
          {
            timings: timingsStub,
            daoFac: {
              daoFor: stub().returns({
                create: stub()
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
      this.message.create({}, 1);
    }, '`deps.daoFac` is a required argument to message.create()');
  });

  test('Has id', function() {
    this.message.id = 1;

    assert.throws(() => {
      this.message.create({
        daoFac: {
          daoFor: stub().returns({
            create: stub()
              .usingPromise(Promise)
              .resolves(null)
          })
        }
      });
    }, 'Cannot call message.create() on message already in storage');
  });

  test('No Data Returned', async function() {
    const createStub = stub()
      .usingPromise(Promise)
      .resolves();

    const daoStub = stub().returns({
      create: createStub
    });

    await this.message
      .create({
        daoFac: {
          daoFor: daoStub
        }
      })
      .catch(error => {
        assert.equal(error, 'Error: Failure to retrieve newly created message');
      });

    assert.ok(
      createStub.calledWith({ daoFac: { daoFor: daoStub } }, createData())
    );
  });

  test('Data Returns', async function() {
    const createStub = stub()
      .usingPromise(Promise)
      .resolves(messageData());

    const daoStub = stub().returns({
      create: createStub
    });

    const messages = await this.message.create({
      daoFac: {
        daoFor: daoStub
      }
    });

    assert.ok(
      createStub.calledWith({ daoFac: { daoFor: daoStub } }, createData())
    );

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
