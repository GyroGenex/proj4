'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MaterialMaster extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      MaterialMaster.hasMany(models.Inventory, {
        foreignKey: 'material_Id',
        as: 'inventories'
      });
    };

  }
  MaterialMaster.init({
    material_description: DataTypes.STRING,
    BUOM: DataTypes.STRING,
    price: DataTypes.DECIMAL,
  }, {
    sequelize,
    modelName: 'MaterialMaster',
  });
  return MaterialMaster;
};