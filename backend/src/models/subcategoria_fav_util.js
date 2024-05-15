const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('subcategoria_fav_util', {
    subcategoria_fav_utilid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    subcategoriaid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'subcategoria',
        key: 'subcategoriaid'
      }
    },
    utilizadorid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'utilizador',
        key: 'utilizadorid'
      }
    },
    datacriacao: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    dataalteracao: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'subcategoria_fav_util',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "subcategoria_fav_util_pkey",
        unique: true,
        fields: [
          { name: "subcategoria_fav_utilid" },
        ]
      },
    ]
  });
};
