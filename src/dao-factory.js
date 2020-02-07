'use strict';
const Promise = require('bluebird');
const Message = require('./dao/message');

/**
 * Factory for initialising Data Access Objects
 *
 * The DAO acts as an intermediary between the Data
 * Stores and the Buiness Objects ensuring that the
 * Business layer is separated completely from the
 * Persistence layer
 */

module.exports = class DaoFac {
  constructor(store) {
    this.store = store;
  }

  /**
   * Initialise DAO for a given name string
   *
   * Provides an easy lookup for DAO's in Business Objects
   *
   * @args {string} daoNam - Name of dao
   * @returns {DAO} - The DAO instance (or errors)
   */
  daoFor(daoName) {
    switch (daoName) {
      case 'message':
        return new Message(this.store);
      default:
        throw new Error(`No DAO for ${daoName}`);
    }
  }
};
