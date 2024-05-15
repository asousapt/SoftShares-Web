const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('denuncia', {
    denunciaid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    comentarioid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'comentario',
        key: 'comentarioid'
      }
    },
    utilizadorcriou: {
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
    utilizadormodera: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'utilizador',
        key: 'utilizadorid'
      }
    },
    datatratamento: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'denuncia',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "denuncia_pkey",
        unique: true,
        fields: [
          { name: "denunciaid" },
        ]
      },
    ]
  });
};
