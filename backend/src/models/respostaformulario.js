const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('respostaformulario', {
    respostaformularioid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    itemrespostaformularioid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'itemrespostaformulario',
        key: 'itemrespostaformularioid'
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
    tableName: 'respostaformulario',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "respostaformulario_pkey",
        unique: true,
        fields: [
          { name: "respostaformularioid" },
        ]
      },
    ]
  });
};
