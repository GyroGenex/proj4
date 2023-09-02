'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Inventories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      material_Id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'MaterialMasters',
          key: 'id',
        },
      },

      quantity_unrestricted: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      quantity_blocked: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      batch_number: {
        allowNull: false,
        type: Sequelize.STRING,

      },
      expiry_date: {
        allowNull: false,
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Inventories');
  }
};