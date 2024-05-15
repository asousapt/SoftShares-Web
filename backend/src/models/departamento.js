const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('departamento', {
    departamentoid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    inactivo: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
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
    }
  }, {
    sequelize,
    tableName: 'departamento',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "departamento_pkey",
        unique: true,
        fields: [
          { name: "departamentoid" },
        ]
      },
    ]
  });
};
