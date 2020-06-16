module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('configs', {
      id: {
        type: Sequelize.INTEGER,
        alloNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true,
      },
      key: {
        allowNull: false,
        type: Sequelize.JSON,
        get() {
          return JSON.parse(this.getDataValue('value'));
        },
        set(value) {
          this.setDataValue('value', JSON.stringify(value));
        },
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('configs');
  },
};
