const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('avaliacao', {
    avaliacaoid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    itemavaliacaoid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'itemavaliacao',
        key: 'itemavaliacaoid'
      }
    },
    utilizadorid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'utilizador',
        key: 'utilizadorid'
      }
    },
    avaliacao: {
      type: DataTypes.INTEGER,
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
    tableName: 'avaliacao',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "avaliacao_pkey",
        unique: true,
        fields: [
          { name: "avaliacaoid" },
        ]
      },
    ]
  });
};
