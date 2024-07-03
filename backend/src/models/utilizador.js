const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('utilizador', {
    utilizadorid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    poloid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'polo',
        key: 'poloid'
      }
    },
    perfilid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'perfil',
        key: 'perfilid'
      }
    },
    pnome: {
      type: DataTypes.STRING(60),
      allowNull: false
    },
    unome: {
      type: DataTypes.STRING(60),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(60),
      allowNull: false,
      unique: "utilizador_email_key"
    },
    passwd: {
      type: DataTypes.STRING(60),
      allowNull: false
    },
    chavesalt: {
      type: DataTypes.STRING(60),
      allowNull: false
    },
    idiomaid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'idioma',
        key: 'idiomaid'
      }
    },
    departamentoid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'departamento',
        key: 'departamentoid'
      }
    },
    funcaoid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'funcao',
        key: 'funcaoid'
      }
    },
    sobre: {
      type: DataTypes.STRING(60),
      allowNull: false,
      defaultValue: ""
    },
    inactivo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    datainactivacao: {
      type: DataTypes.DATE,
      allowNull: true
    },
    ultimologin: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null
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
    tableName: 'utilizador',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "utilizador_polo_key",
        unique: true,
        fields: [
          { name: "descricao" },
        ]
      },
      {
        name: "utilizador_pkey",
        unique: true,
        fields: [
          { name: "utilizadorid" },
        ]
      },
    ]
  });
};
