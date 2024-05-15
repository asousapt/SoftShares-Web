const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('traducao', {
    traducaoid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    chaveid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'chave',
        key: 'chaveid'
      }
    },
    idiomaid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'idioma',
        key: 'idiomaid'
      }
    },
    valor: {
      type: DataTypes.STRING(140),
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
    tableName: 'traducao',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "traducao_pkey",
        unique: true,
        fields: [
          { name: "traducaoid" },
        ]
      },
    ]
  });
};
