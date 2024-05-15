const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('itemcomentario', {
    itemcomentarioid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    registoid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tipo: {
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
    tableName: 'itemcomentario',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "itemcomentario_pkey",
        unique: true,
        fields: [
          { name: "itemcomentarioid" },
        ]
      },
    ]
  });
};
