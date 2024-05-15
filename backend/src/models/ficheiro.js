const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ficheiro', {
    ficheiroid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    albumid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'album',
        key: 'albumid'
      }
    },
    caminho: {
      type: DataTypes.STRING(60),
      allowNull: false
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    extensao: {
      type: DataTypes.STRING(6),
      allowNull: false
    },
    tamanho: {
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
    tableName: 'ficheiro',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "ficheiro_pkey",
        unique: true,
        fields: [
          { name: "ficheiroid" },
        ]
      },
    ]
  });
};
