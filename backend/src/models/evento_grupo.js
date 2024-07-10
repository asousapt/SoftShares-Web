const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        "evento_grupo",
        {
            evento_grupoid: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            grupoid: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "grupo",
                    key: "grupoid",
                },
            },
            eventoid: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "evento",
                    key: "eventoid",
                },
            },
            datacriacao: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            dataalteracao: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
            },
        },
        {
            tableName: "evento_grupo",
            schema: "public",
            timestamps: false,
            indexes: [
                {
                    name: "evento_grupo_pkey",
                    unique: true,
                    fields: [
                        { name: "evento_grupoid" },
                    ],
                },
            ],
        }
    );
};
