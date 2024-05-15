const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('formulariodetalhes', {
    formulariodetalhesid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    formularioversaoid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'formularioversao',
        key: 'formularioversaoid'
      }
    },
    pergunta: {
      type: DataTypes.STRING(160),
      allowNull: false
    },
    tipodados: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    obrigatorio: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    respostaspossiveis: {
      type: DataTypes.STRING(200),
      allowNull: false,
      defaultValue: ""
    },
    minimo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    maximo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    tamanho: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    ordem: {
      type: DataTypes.INTEGER,
      allowNull: false
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
    tableName: 'formulariodetalhes',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "formulariodetalhes_pkey",
        unique: true,
        fields: [
          { name: "formulariodetalhesid" },
        ]
      },
    ]
  });
};
