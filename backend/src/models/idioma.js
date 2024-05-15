const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('idioma', {
    idiomaid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    descricao: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    icone: {
      type: DataTypes.STRING(25),
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
    tableName: 'idioma',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "idioma_pkey",
        unique: true,
        fields: [
          { name: "idiomaid" },
        ]
      },
    ]
  });
};
