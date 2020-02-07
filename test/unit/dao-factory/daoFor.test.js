'use strict';
const assert = require('chai').assert;

const DaoFac = require('../../../src/dao-factory');

suite('daoFor', function() {
  test('No Dao', function() {
    const daoFac = new DaoFac({});

    assert.throws(() => daoFac.daoFor('test'), 'No DAO for test');
  });

  test('DAO', function() {
    const daoFac = new DaoFac({});

    assert.deepEqual(daoFac.daoFor('message'), { store: {} });
  });
});
