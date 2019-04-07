'use strict';
const fixtureData = require('../../database/fixtures/messagedata.fixture');

module.exports = {
  populate(store) {
    return fixtureData(store.messageStore);
  },
  depopulate(store) {
    return store.messageStore.models.message.destroy({
      where: {},
      truncate: true
    });
  }
};
