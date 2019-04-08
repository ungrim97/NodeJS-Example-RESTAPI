'use strict';
const assert = require('chai').assert;

const DaoFac = require('../../../src/dao-factory');

suite('daoFor', function() {
  test('No Dao', function() {
    const daoFac = new DaoFac({});

    return daoFac
      .daoFor('test')
      .then(() => {
        assert.isNotOk(true);
      })
      .catch(error => {
        assert.equal(error, 'Error: No DAO for test');
      });
  });

  test('DAO', async function() {
    const daoFac = new DaoFac({});

    const dao = await daoFac.daoFor('message');
    assert.deepEqual(dao, { store: {} });
  });
});
