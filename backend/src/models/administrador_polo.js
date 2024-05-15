const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('administrador_polo', {
    administrador_poloid: {
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
    poloid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'polo',
        key: 'poloid'
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
    }
  }, {
    sequelize,
    tableName: 'administrador_polo',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "administrador_polo_pkey",
        unique: true,
        fields: [
          { name: "administrador_poloid" },
        ]
      },
    ]
  });
};
