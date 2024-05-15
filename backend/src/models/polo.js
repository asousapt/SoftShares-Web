const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('polo', {
    poloid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    cidadeid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'cidade',
        key: 'cidadeid'
      }
    },
    descricao: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    morada: {
      type: DataTypes.STRING(160),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(160),
      allowNull: false
    },
    telefone: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    coordenador: {
      type: DataTypes.STRING(100),
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
    tableName: 'polo',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "polo_pkey",
        unique: true,
        fields: [
          { name: "poloid" },
        ]
      },
    ]
  });
};
