const { Sequelize, Op } = require('sequelize');
const initModels = require('../models/init-models');
const sequelizeConn = require('../bdConexao');
const models = initModels(sequelizeConn);

const sessaoController = {
    adicionar: async (req, res) => {
        const { utilizadorid, datainicio, datafim, enderecoip } = req.body;

        try {
            await models.sessao.create({
                utilizadorid: utilizadorid,
                datainicio: datainicio,
                datafim: datafim,
                enderecoip: enderecoip
            });

            res.status(201).json({ message: 'Sessão adicionada com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao adicionar sessão', details: error.message });
        }
    },

    atualizar: async (req, res) => {
        const { idSessao } = req.params;
        const { utilizadorid, datainicio, datafim, enderecoip } = req.body;

        try {
            await models.sessao.update({
                utilizadorid: utilizadorid,
                datainicio: datainicio,
                datafim: datafim,
                enderecoip: enderecoip
            }, {
                where: {
                    sessaoid: idSessao
                }
            });

            res.status(200).json({ message: 'Sessão atualizada com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar sessão', details: error.message });
        }
    },

    remover: async (req, res) => {
        const { idSessao } = req.params;

        try {
            await models.sessao.destroy({
                where: {
                    sessaoid: idSessao
                }
            });

            res.status(200).json({ message: 'Sessão removida com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao remover sessão', details: error.message });
        }
    },

    consultarTudo: async (req, res) => {
        try {
            const sessoes = await models.sessao.findAll();
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: sessoes });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar sessões', details: error.message });
        }
    },

    consultarPorUtilizador: async (req, res) => {
        const { idUtilizador } = req.params;

        try {
            const sessoes = await models.sessao.findAll({
                where: {
                    utilizadorid: idUtilizador
                }
            });
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: sessoes });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar sessões por utilizador', details: error.message });
        }
    }
};

module.exports = sessaoController;
