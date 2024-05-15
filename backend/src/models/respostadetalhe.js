const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('respostadetalhe', {
    respostadetalheid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    respostaformularioid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'respostaformulario',
        key: 'respostaformularioid'
      }
    },
    formulariodetalhesid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'formulariodetalhes',
        key: 'formulariodetalhesid'
      }
    },
    resposta: {
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
    }
  }, {
    sequelize,
    tableName: 'respostadetalhe',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "respostadetalhe_pkey",
        unique: true,
        fields: [
          { name: "respostadetalheid" },
        ]
      },
    ]
  });
};
