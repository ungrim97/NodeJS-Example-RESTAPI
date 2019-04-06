const Model = require('sequelize').Model;

module.exports = class Message extends Model {
  static init(sequelize, Sequelize) {
    return super.init(
      {
        id: {
          type: Sequelize.INTEGER,
          autoincrement: true,
          primaryKey: true
        },
        text: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        createdAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW
        },
        updatedAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW
        },
        createdBy: Sequelize.STRING(20),
        updatedBy: Sequelize.STRING(20),
        owner: Sequelize.STRING
      },
      { sequelize }
    );
  }
};
