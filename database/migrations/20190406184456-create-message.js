module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('messages', {
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
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('messages');
  }
};
