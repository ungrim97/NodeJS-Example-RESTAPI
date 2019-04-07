const Promise = require('bluebird');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async t => {
      // Sequelize doesn't provide an interface for this. Do it manually
      await queryInterface.sequelize.query(
        'ALTER TABLE `messages` DROP PRIMARY KEY, CHANGE id id int(11) PRIMARY KEY AUTO_INCREMENT',
        { transaction: t }
      );

      // Sequelize bug https://github.com/sequelize/sequelize/issues/8868;
      await queryInterface.sequelize.query(
        'ALTER TABLE `messages` CHANGE createdAt created_at datetime DEFAULT CURRENT_TIMESTAMP',
        {
          transaction: t
        }
      );
      await queryInterface.sequelize.query(
        'ALTER TABLE `messages` CHANGE updatedAt updated_at datetime DEFAULT CURRENT_TIMESTAMP',
        {
          transaction: t
        }
      );
      await queryInterface.sequelize.query(
        'ALTER TABLE `messages` CHANGE createdBy created_by varchar(20) NOT NULL',
        {
          transaction: t
        }
      );
      await queryInterface.sequelize.query(
        'ALTER TABLE `messages` CHANGE updatedBy updated_by varchar(20) NOT NULL',
        {
          transaction: t
        }
      );
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async t => {
      // Sequelize doesn't provide an interface for these. Do them manually
      await queryInterface.sequelize.query(
        'ALTER TABLE `messages` DROP PRIMARY KEY, CHANGE id id int(11) PRIMARY KEY NOT NULL',
        { transaction: t }
      );

      // Sequelize bug https://github.com/sequelize/sequelize/issues/8868
      await queryInterface.sequelize.query(
        'ALTER TABLE `messages` CHANGE created_at createdAt datetime DEFAULT CURRENT_TIMESTAMP',
        {
          transaction: t
        }
      );
      await queryInterface.sequelize.query(
        'ALTER TABLE `messages` CHANGE updated_at updatedAt datetime DEFAULT CURRENT_TIMESTAMP',
        {
          transaction: t
        }
      );
      await queryInterface.sequelize.query(
        'ALTER TABLE `messages` CHANGE created_by createdBy varchar(20)',
        {
          transaction: t
        }
      );
      await queryInterface.sequelize.query(
        'ALTER TABLE `messages` CHANGE updated_by updatedBy varchar(20)',
        {
          transaction: t
        }
      );
    });
  }
};
