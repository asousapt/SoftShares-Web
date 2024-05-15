const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('authsso', {
    authssoid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    utilizadorid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'utilizador',
        key: 'utilizadorid'
      }
    },
    token: {
      type: DataTypes.STRING(60),
      allowNull: false
    },
    validade: {
      type: DataTypes.DATE,
      allowNull: false
    },
    provedor: {
      type: DataTypes.CHAR(2),
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
    tableName: 'authsso',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "authsso_pkey",
        unique: true,
        fields: [
          { name: "authssoid" },
        ]
      },
    ]
  });
};
