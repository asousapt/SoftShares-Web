const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('itemavaliacao', {
    itemavaliacaoid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    itemorigid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tipoentidade: {
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
    tableName: 'itemavaliacao',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "itemavaliacao_pkey",
        unique: true,
        fields: [
          { name: "itemavaliacaoid" },
        ]
      },
    ]
  });
};
