const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('funcao', {
    funcaoid: {
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
    tableName: 'funcao',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "funcao_pkey",
        unique: true,
        fields: [
          { name: "funcaoid" },
        ]
      },
    ]
  });
};
