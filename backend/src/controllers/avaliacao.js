const { Sequelize, Op } = require('sequelize');
const initModels = require('../models/init-models');
const sequelizeConn = require('../bdConexao');
const models = initModels(sequelizeConn);

const avaliacaoController = {
    adicionar: async (req, res) => {
        const { itemavaliacaoid, utilizadorid, avaliacao } = req.body;

        try {
            await models.avaliacao.create({
                itemavaliacaoid: itemavaliacaoid,
                utilizadorid: utilizadorid,
                avaliacao: avaliacao
            });

            res.status(201).json({ message: 'Avaliação adicionada com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao adicionar avaliação', details: error.message });
        }
    },

    atualizar: async (req, res) => {
        const { idAvaliacao } = req.params;
        const { itemavaliacaoid, utilizadorid, avaliacao } = req.body;

        try {
            await models.avaliacao.update({
                itemavaliacaoid: itemavaliacaoid,
                utilizadorid: utilizadorid,
                avaliacao: avaliacao
            }, {
                where: {
                    avaliacaoid: idAvaliacao
                }
            });

            res.status(200).json({ message: 'Avaliação atualizada com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar avaliação', details: error.message });
        }
    },

    remover: async (req, res) => {
        const { idAvaliacao } = req.params;

        try {
            await models.avaliacao.destroy({
                where: {
                    avaliacaoid: idAvaliacao
                }
            });

            res.status(200).json({ message: 'Avaliação removida com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao remover avaliação', details: error.message });
        }
    },

    consultarTudo: async (req, res) => {
        try {
            const avaliacoes = await models.avaliacao.findAll();
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: avaliacoes });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar avaliações', details: error.message });
        }
    },

    consultarPorItem: async (req, res) => {
        const { itemAvaliacaoId } = req.params;

        try {
            const avaliacoes = await models.avaliacao.findAll({
                where: {
                    itemavaliacaoid: itemAvaliacaoId
                }
            });
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: avaliacoes });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar avaliações por item', details: error.message });
        }
    }
};

module.exports = avaliacaoController;
