const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('chave', {
    chaveid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    registoid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: "uk_chave_entidade"
    },
    entidade: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: "uk_chave_entidade"
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
    tableName: 'chave',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "chave_pkey",
        unique: true,
        fields: [
          { name: "chaveid" },
        ]
      },
      {
        name: "uk_chave_entidade",
        unique: true,
        fields: [
          { name: "registoid" },
          { name: "entidade" },
        ]
      },
    ]
  });
};
