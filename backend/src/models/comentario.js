const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('comentario', {
        comentarioid: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        itemcomentarioid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'itemcomentario',
                key: 'itemcomentarioid'
            }
        },
        utilizadorid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'utilizador',
                key: 'utilizadorid'
            }
        },
        comentario: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        datacriacao: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        dataalteracao: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
    }, {
        tableName: 'comentario',
        schema: 'public',
        timestamps: false,
        indexes: [
            {
                name: "comentario_pkey",
                unique: true,
                fields: [
                    { name: "comentarioid" },
                ]
            },
        ]
    });
};
