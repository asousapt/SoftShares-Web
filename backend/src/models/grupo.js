const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('grupo', {
    grupoid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nome: {
      type: DataTypes.STRING(80),
      allowNull: false
    },
    descricao: {
      type: DataTypes.STRING(160),
      allowNull: false
    },
    publico: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    subcategoriaid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'subcategoria',
        key: 'subcategoriaid'
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
    },
    utilizadorcriou: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'utilizador',
        key: 'utilizadorid'
      }
    }
  }, {
    sequelize,
    tableName: 'grupo',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "grupo_pkey",
        unique: true,
        fields: [
          { name: "grupoid" },
        ]
      },
    ]
  });
};
