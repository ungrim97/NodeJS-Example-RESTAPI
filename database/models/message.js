const Model = require('sequelize').Model;

module.exports = class Message extends Model {
  static init(sequelize, Sequelize) {
    return super.init(
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        text: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        createdAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.fn('now')
        },
        updatedAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.fn('now')
        },
        createdBy: {
          type: Sequelize.STRING(20)
        },
        updatedBy: {
          type: Sequelize.STRING(20)
        },
        owner: {
          type: Sequelize.STRING
        }
      },
      {
        tableName: 'messages',
        underscored: true,
        sequelize: sequelize
      }
    );
  }
};
