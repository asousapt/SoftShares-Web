const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('categoria', {
    categoriaid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    cor: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    icone: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    inactivo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    desistema: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
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
    tableName: 'categoria',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "categoria_pkey",
        unique: true,
        fields: [
          { name: "categoriaid" },
        ]
      },
    ]
  });
};
