const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('thread', {
    threadid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    subcategoriaid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'subcategoria',
        key: 'subcategoriaid'
      }
    },
    utilizadorid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'utilizador',
        key: 'utilizadorid'
      }
    },
    titulo: {
      type: DataTypes.STRING(140),
      allowNull: false
    },
    mensagem: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    utilizadoraprovou: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'utilizador',
        key: 'utilizadorid'
      }
    },
    dataaprovacao: {
      type: DataTypes.DATE,
      allowNull: true
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
    idiomaid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'idioma',
        key: 'idiomaid'
      }
    },
    inactivo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    tableName: 'thread',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "thread_pkey",
        unique: true,
        fields: [
          { name: "threadid" },
        ]
      },
    ]
  });
};
