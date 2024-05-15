const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sessao', {
    sessaoid: {
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
    datainicio: {
      type: DataTypes.DATE,
      allowNull: false
    },
    datafim: {
      type: DataTypes.DATE,
      allowNull: true
    },
    enderecoip: {
      type: DataTypes.STRING(20),
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
    tableName: 'sessao',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "sessao_pkey",
        unique: true,
        fields: [
          { name: "sessaoid" },
        ]
      },
    ]
  });
};
