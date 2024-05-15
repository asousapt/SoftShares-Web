const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('evento', {
    eventoid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    titulo: {
      type: DataTypes.STRING(160),
      allowNull: false
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    datainicio: {
      type: DataTypes.DATE,
      allowNull: false
    },
    datafim: {
      type: DataTypes.DATE,
      allowNull: false
    },
    dataliminscricao: {
      type: DataTypes.DATE,
      allowNull: false
    },
    cancelado: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    nmrmaxparticipantes: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    localizacao: {
      type: DataTypes.STRING(160),
      allowNull: false
    },
    latitude: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    longitude: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    cidadeid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'cidade',
        key: 'cidadeid'
      }
    },
    datacriacao: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    dataalteracao: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    utilizadorcriou: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'utilizador',
        key: 'utilizadorid'
      }
    },
    utilizadoraprovou: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'utilizador',
        key: 'utilizadorid'
      }
    },
    aprovado: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    dataaprovacao: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'evento',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "evento_pkey",
        unique: true,
        fields: [
          { name: "eventoid" },
        ]
      },
    ]
  });
};
