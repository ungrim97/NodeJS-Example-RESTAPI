'use strict';
module.exports = message_store => {
  return message_store.models.message.bulkCreate([
    {
      text: 'This is a test 📙',
      owner: '1',
      createdAt: '2019-01-01 00:00:00Z',
      updatedAt: '2019-01-01 00:00:00Z',
      createdBy: 'testUser',
      updatedBy: 'testUser'
    },
    {
      text: 'This is another test 📙',
      owner: '2',
      createdAt: '2019-01-01 00:00:00Z',
      updatedAt: '2019-01-01 00:00:00Z',
      createdBy: 'testUser',
      updatedBy: 'testUser'
    }
  ]);
};
