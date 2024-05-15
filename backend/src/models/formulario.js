const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('formulario', {
    formularioid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    itemcfgformularioid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'itemcfgformulario',
        key: 'itemcfgformularioid'
      }
    },
    tipoformulario: {
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
    tableName: 'formulario',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "formulario_pkey",
        unique: true,
        fields: [
          { name: "formularioid" },
        ]
      },
    ]
  });
};
