const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('notificacao', {
    notificacaoid: {
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
    notificacao: {
      type: DataTypes.TEXT,
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
    },
    vista: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    tipo: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    idregisto: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    sequelize,
    tableName: 'notificacao',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "notificacao_pkey",
        unique: true,
        fields: [
          { name: "notificacaoid" },
        ]
      },
    ]
  });
};
