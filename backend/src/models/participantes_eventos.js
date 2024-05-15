const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('participantes_eventos', {
    participantes_eventosid: {
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
      },
      unique: "uk_utilizador_evento"
    },
    eventoid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'evento',
        key: 'eventoid'
      },
      unique: "uk_utilizador_evento"
    },
    convidadosadic: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
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
    tableName: 'participantes_eventos',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "participantes_eventos_pkey",
        unique: true,
        fields: [
          { name: "participantes_eventosid" },
        ]
      },
      {
        name: "uk_utilizador_evento",
        unique: true,
        fields: [
          { name: "utilizadorid" },
          { name: "eventoid" },
        ]
      },
    ]
  });
};
