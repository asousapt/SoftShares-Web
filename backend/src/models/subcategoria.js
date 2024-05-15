const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('subcategoria', {
    subcategoriaid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    categoriaid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categoria',
        key: 'categoriaid'
      }
    },
    desistema: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    inactivo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
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
    tableName: 'subcategoria',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "subcategoria_pkey",
        unique: true,
        fields: [
          { name: "subcategoriaid" },
        ]
      },
    ]
  });
};
