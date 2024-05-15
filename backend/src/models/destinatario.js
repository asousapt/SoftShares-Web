const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('destinatario', {
    destinatarioid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    itemdestinatario: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tipo: {
      type: DataTypes.CHAR(2),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'destinatario',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "destinatario_pkey",
        unique: true,
        fields: [
          { name: "destinatarioid" },
        ]
      },
    ]
  });
};
