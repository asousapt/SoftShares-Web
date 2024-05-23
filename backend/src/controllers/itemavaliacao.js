const { Sequelize, QueryTypes } = require('sequelize');
const initModels = require('../models/init-models');
const sequelizeConn = require('../bdConexao');
const models = initModels(sequelizeConn);

const controladorItemAvaliacao = {
    adicionar: async (req, res) => {
        const { itemorigid, tipoentidade } = req.body;

        try {
            const itemAvaliacao = await models.itemavaliacao.create({
                itemorigid: itemorigid,
                tipoentidade: tipoentidade
            });

            res.status(201).json({ message: 'Item de avaliação adicionado com sucesso', data: itemAvaliacao });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao adicionar item de avaliação', details: error.message });
        }
    },

    atualizar: async (req, res) => {
        const { id } = req.params;
        const { itemorigid, tipoentidade } = req.body;

        try {
            const itemAvaliacao = await models.itemavaliacao.findByPk(id);
            if (!itemAvaliacao) {
                return res.status(404).json({ error: 'Item de avaliação não encontrado' });
            }

            await models.itemavaliacao.update({
                itemorigid: itemorigid,
                tipoentidade: tipoentidade
            }, {
                where: {
                    itemavaliacaoid: id
                }
            });

            res.status(200).json({ message: 'Item de avaliação atualizado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar item de avaliação', details: error.message });
        }
    },

    remover: async (req, res) => {
        const { id } = req.params;

        try {
            const itemAvaliacao = await models.itemavaliacao.findByPk(id);
            if (!itemAvaliacao) {
                return res.status(404).json({ error: 'Item de avaliação não encontrado' });
            }

            await models.itemavaliacao.destroy({
                where: {
                    itemavaliacaoid: id
                }
            });

            res.status(200).json({ message: 'Item de avaliação removido com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao remover item de avaliação', details: error.message });
        }
    },

    consultarPorTipoEntidade: async (req, res) => {
        const { tipoentidade } = req.params;

        try {
            const itensAvaliacao = await models.itemavaliacao.findAll({
                where: {
                    tipoentidade: tipoentidade
                }
            });

            res.status(200).json({ message: 'Consulta realizada com sucesso', data: itensAvaliacao });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar itens de avaliação por tipo de entidade', details: error.message });
        }
    },

    consultarTodos: async (req, res) => {
        try {
            const itensAvaliacao = await models.itemavaliacao.findAll();
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: itensAvaliacao });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar utilizador', details: error.message });
        }
    },
};

module.exports = controladorItemAvaliacao;
