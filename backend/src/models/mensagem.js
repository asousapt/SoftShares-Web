const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mensagem', {
    mensagemid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    destinatarioid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'destinatario',
        key: 'destinatarioid'
      }
    },
    mensagem: {
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
    remetenteid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'utilizador',
        key: 'utilizadorid'
      }
    }
  }, {
    sequelize,
    tableName: 'mensagem',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "mensagem_pkey",
        unique: true,
        fields: [
          { name: "mensagemid" },
        ]
      },
    ]
  });
};
