const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('perfil', {
    perfilid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    descricao: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    configsistema: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    moderaconteudo: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    utilnormal: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
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
    tableName: 'perfil',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "perfil_pkey",
        unique: true,
        fields: [
          { name: "perfilid" },
        ]
      },
    ]
  });
};
