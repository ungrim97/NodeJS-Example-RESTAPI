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
   * @returns {Promise<DAO>} - Promise that resolves to the DAO instance (or errors)
   */
  daoFor(daoName) {
    return new Promise((resolve, reject) => {
      switch (daoName) {
        case 'message':
          return resolve(new Message(this.store));
          break;
        default:
          return reject(new Error(`No DAO for ${daoName}`));
          break;
      }
    });
  }
};
