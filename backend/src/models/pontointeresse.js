const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pontointeresse', {
    pontointeresseid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    subcategoriaid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'subcategoria',
        key: 'subcategoriaid'
      }
    },
    titulo: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    aprovado: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    dataaprovacao: {
      type: DataTypes.DATE,
      allowNull: true
    },
    utilizadoraprova: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'utilizador',
        key: 'utilizadorid'
      }
    },
    localizacao: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    latitude: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    longitude: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    idiomaid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'idioma',
        key: 'idiomaid'
      }
    },
    cidadeid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'cidade',
        key: 'cidadeid'
      }
    },
    poloid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'polo',
        key: 'poloid'
      }
    },
    datacriacao: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    dataalteracao: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    utilizadorcriou: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'utilizador',
        key: 'utilizadorid'
      }
    }
  }, {
    sequelize,
    tableName: 'pontointeresse',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pontointeresse_pkey",
        unique: true,
        fields: [
          { name: "pontointeresseid" },
        ]
      },
    ]
  });
};
