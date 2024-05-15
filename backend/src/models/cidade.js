const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cidade', {
    cidadeid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    distritoid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'distrito',
        key: 'distritoid'
      }
    },
    nome: {
      type: DataTypes.STRING(60),
      allowNull: false,
      unique: "cidade_nome_key"
    }
  }, {
    sequelize,
    tableName: 'cidade',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "cidade_nome_key",
        unique: true,
        fields: [
          { name: "nome" },
        ]
      },
      {
        name: "cidade_pkey",
        unique: true,
        fields: [
          { name: "cidadeid" },
        ]
      },
    ]
  });
};
