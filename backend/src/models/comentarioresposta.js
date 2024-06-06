const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('comentarioresposta', {
        respostaid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'comentario',
                key: 'comentarioid'
            }
        },
        comentariopaiid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'comentario',
                key: 'comentarioid'
            }
        }
    }, {
        sequelize,
        tableName: 'comentarioresposta',
        schema: 'public',
        timestamps: false,
        indexes: [
            {
                name: "comentarioresposta_pkey",
                unique: true,
                fields: [
                    { name: "respostaid" },
                    { name: "comentariopaiid" }
                ]
            }
        ]
    });
};
