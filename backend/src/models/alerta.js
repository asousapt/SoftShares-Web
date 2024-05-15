const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('alerta', {
    alertaid: {
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
    texto: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    idiomaid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'idioma',
        key: 'idiomaid'
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
    inactivo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
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
    tableName: 'alerta',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "alerta_pkey",
        unique: true,
        fields: [
          { name: "alertaid" },
        ]
      },
    ]
  });
};
