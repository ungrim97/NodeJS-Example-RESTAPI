const Sequelize = require('sequelize');

/**
 * Sequelize ORM store for the message_store database
 *
 * @returns {Object} store - Object with sequlize and models key
 * @returns {Object} store.sequelize - Raw sequelize instance
 * @returns {Object} store.models.message - Message sequelize model
 */

// Models
const Message = require('../../database/models/message');

module.exports = config => {
  const dbOpts = {
    host: config.get('host'),
    dialect: config.get('dialect'),
    port: config.get('port')
  };

  if (config.get('pool')) {
    dbOpts.pool = config.get('pool');
  }

  // Initialize Sequelize
  const sequelize = new Sequelize(
    config.get('database'),
    config.get('user'),
    config.get('password'),
    dbOpts
  );

  // Initialize models
  return {
    models: {
      message: Message.init(sequelize, Sequelize)
    },
    sequelize
  };
};
