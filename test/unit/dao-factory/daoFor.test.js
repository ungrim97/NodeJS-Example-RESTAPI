const assert = require('chai').assert;

const DaoFac = require('../../../src/dao-factory');

suite('daoFor', function() {
  test('No Dao', function() {
    const daoFac = new DaoFac({});
    daoFac.daos = {};

    daoFac.daoFor('test').catch(error => {
      assert.equal(error, 'Error: No DAO for test');
    });
  });

  test('DAO', async function() {
    const daoFac = new DaoFac({});
    daoFac.daos = {
      test: { store: {} }
    };

    const dao = await daoFac.daoFor('test');
    assert.deepEqual(dao, { store: {} });
  });
});
