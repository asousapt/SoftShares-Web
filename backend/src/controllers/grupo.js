const { Sequelize, QueryTypes } = require('sequelize');
const initModels = require('../models/init-models');
const sequelizeConn = require('../bdConexao');
const models = initModels(sequelizeConn);

const controladorGrupo = {
    adicionar: async (req, res) => {
        const { descricao, publico, subcategoriaid, utilizadorcriou } = req.body;

        try {
            const grupo = await models.grupo.create({
                descricao: descricao,
                publico: publico,
                subcategoriaid: subcategoriaid,
                utilizadorcriou: utilizadorcriou
            });

            res.status(201).json({ message: 'Grupo adicionado com sucesso'});
        } catch (error) {
            res.status(500).json({ error: 'Erro ao adicionar grupo', details: error.message });
        }
    },

    atualizar: async (req, res) => {
        const { id } = req.params;
        const { descricao, publico, subcategoriaid, utilizadorcriou } = req.body;

        try {
            const grupo = await models.grupo.findByPk(id);
            if (!grupo) {
                return res.status(404).json({ error: 'Grupo não encontrado' });
            }

            await models.grupo.update({
                descricao: descricao,
                publico: publico,
                subcategoriaid: subcategoriaid,
                utilizadorcriou: utilizadorcriou
            }, {
                where: {
                    grupoid: id
                }
            });

            res.status(200).json({ message: 'Grupo atualizado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar grupo', details: error.message });
        }
    },

    remover: async (req, res) => {
        const { id } = req.params;

        try {
            const grupo = await models.grupo.findByPk(id);
            if (!grupo) {
                return res.status(404).json({ error: 'Grupo não encontrado' });
            }

            await models.grupo.destroy({
                where: {
                    grupoid: id
                }
            });

            res.status(200).json({ message: 'Grupo removido com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao remover grupo', details: error.message });
        }
    },

    consultarPorSubcategoria: async (req, res) => {
        const { subcategoriaid } = req.params;

        try {
            const grupos = await models.grupo.findAll({
                where: {
                    subcategoriaid: subcategoriaid
                }
            });

            res.status(200).json({ message: 'Consulta realizada com sucesso', data: grupos });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar grupos por subcategoria', details: error.message });
        }
    },

    consultarPorUtilizador: async (req, res) => {
        const { utilizadorid } = req.params;

        try {
            const grupos = await models.grupo.findAll({
                where: {
                    utilizadorcriou: utilizadorid
                }
            });

            res.status(200).json({ message: 'Consulta realizada com sucesso', data: grupos });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar grupos por utilizador', details: error.message });
        }
    }
};

module.exports = controladorGrupo;
