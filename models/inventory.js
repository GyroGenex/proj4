'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Inventory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Inventory.belongsTo(models.MaterialMaster, {
        foreignKey: 'id',
        as: 'material_master'
      });
    }
  }
  Inventory.init({
    quantity_unrestricted: DataTypes.INTEGER,
    quantity_blocked: DataTypes.INTEGER,
    batch_number: DataTypes.STRING,
    expiry_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Inventory',
  });
  return Inventory;
};