const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('utilizador_grupo', {
    utilizador_grupoid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    grupoid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'grupo',
        key: 'grupoid'
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
    tableName: 'utilizador_grupo',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "utilizador_grupo_pkey",
        unique: true,
        fields: [
          { name: "utilizador_grupoid" },
        ]
      },
    ]
  });
};
