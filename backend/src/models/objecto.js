const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('objecto', {
    objectoid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    registoid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: "uk_registo_entidade"
    },
    entidade: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: "uk_registo_entidade"
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
    tableName: 'objecto',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "objecto_pkey",
        unique: true,
        fields: [
          { name: "objectoid" },
        ]
      },
      {
        name: "uk_registo_entidade",
        unique: true,
        fields: [
          { name: "registoid" },
          { name: "entidade" },
        ]
      },
    ]
  });
};
