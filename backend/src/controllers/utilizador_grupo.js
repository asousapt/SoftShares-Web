const { Sequelize, QueryTypes } = require('sequelize');
const initModels = require('../models/init-models');
const sequelizeConn = require('../bdConexao');
const models = initModels(sequelizeConn);

const controladorUtilizadorGrupo = {
    adicionar: async (req, res) => {
        const { grupoid, utilizadorid } = req.body;

        try {
            const utilizadorGrupo = await models.utilizador_grupo.create({
                grupoid: grupoid,
                utilizadorid: utilizadorid
            });

            res.status(201).json({ message: 'Utilizador adicionado ao grupo com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao adicionar utilizador ao grupo', details: error.message });
        }
    },

    atualizar: async (req, res) => {
        const { id } = req.params;
        const { grupoid, utilizadorid } = req.body;

        try {
            const utilizadorGrupo = await models.utilizador_grupo.findByPk(id);
            if (!utilizadorGrupo) {
                return res.status(404).json({ error: 'Associação utilizador-grupo não encontrada' });
            }

            await models.utilizador_grupo.update({
                grupoid: grupoid,
                utilizadorid: utilizadorid
            }, {
                where: {
                    utilizador_grupoid: id
                }
            });

            res.status(200).json({ message: 'Associação utilizador-grupo atualizada com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar associação utilizador-grupo', details: error.message });
        }
    },

    remover: async (req, res) => {
        const { id } = req.params;

        try {
            const utilizadorGrupo = await models.utilizador_grupo.findByPk(id);
            if (!utilizadorGrupo) {
                return res.status(404).json({ error: 'Associação utilizador-grupo não encontrada' });
            }

            await models.utilizador_grupo.destroy({
                where: {
                    utilizador_grupoid: id
                }
            });

            res.status(200).json({ message: 'Associação utilizador-grupo removida com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao remover associação utilizador-grupo', details: error.message });
        }
    },

    consultarPorGrupo: async (req, res) => {
        const { grupoid } = req.params;

        try {
            const utilizadoresGrupos = await models.utilizador_grupo.findAll({
                where: {
                    grupoid: grupoid
                }
            });

            res.status(200).json({ message: 'Consulta realizada com sucesso', data: utilizadoresGrupos });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar associações por grupo', details: error.message });
        }
    },

    consultarPorUtilizador: async (req, res) => {
        const { utilizadorid } = req.params;

        try {
            const utilizadoresGrupos = await models.utilizador_grupo.findAll({
                where: {
                    utilizadorid: utilizadorid
                }
            });

            res.status(200).json({ message: 'Consulta realizada com sucesso', data: utilizadoresGrupos });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar associações por utilizador', details: error.message });
        }
    }
};

module.exports = controladorUtilizadorGrupo;
