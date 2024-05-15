const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('formularioversao', {
    formularioversaoid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    formularioid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'formulario',
        key: 'formularioid'
      }
    },
    descricao: {
      type: DataTypes.STRING(160),
      allowNull: false
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
    tableName: 'formularioversao',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "formularioversao_pkey",
        unique: true,
        fields: [
          { name: "formularioversaoid" },
        ]
      },
    ]
  });
};
