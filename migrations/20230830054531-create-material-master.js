'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('MaterialMasters', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      material_description: {
        type: Sequelize.STRING,
        unique: true,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      BUOM: {
        allowNull: false,
        type: Sequelize.STRING
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    await queryInterface.sequelize.query("ALTER TABLE Materialmasters AUTO_INCREMENT = 20000001;");
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('MaterialMasters');
  }
};