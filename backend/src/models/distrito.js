const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('distrito', {
    distritoid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nome: {
      type: DataTypes.STRING(60),
      allowNull: false,
      unique: "distrito_nome_key"
    }
  }, {
    sequelize,
    tableName: 'distrito',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "distrito_nome_key",
        unique: true,
        fields: [
          { name: "nome" },
        ]
      },
      {
        name: "distrito_pkey",
        unique: true,
        fields: [
          { name: "distritoid" },
        ]
      },
    ]
  });
};
