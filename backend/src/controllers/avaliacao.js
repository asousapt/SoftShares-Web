const { Sequelize, Op } = require('sequelize');
const initModels = require('../models/init-models');
const sequelizeConn = require('../bdConexao');
const models = initModels(sequelizeConn);

const avaliacaoController = {
    adicionar: async (req, res) => {
        const { tipo, idRegisto, utilizadorid, avaliacao } = req.body;

        try {
            let itemAvaliacao = await models.itemavaliacao.findOne({
                where: {
                    itemorigid: idRegisto,
                    tipoentidade: tipo
                }
            });

            if (!itemAvaliacao) {
                itemAvaliacao = await models.itemavaliacao.create({
                    itemorigid: idRegisto,
                    tipoentidade: tipo
                });
            }

            await models.avaliacao.create({
                itemavaliacaoid: itemAvaliacao.itemavaliacaoid,
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

    consultarAvalicao: async (req, res) => {
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
    },

    adicionarItemAvaliacao: async (req, res) => {
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

    atualizarItemAvaliacao: async (req, res) => {
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

    removerItemAvaliacao: async (req, res) => {
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

    consultarItemAvaliacao: async (req, res) => {
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

    consultarTodosItemAvalicao: async (req, res) => {
        try {
            const itensAvaliacao = await models.itemavaliacao.findAll();
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: itensAvaliacao });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar utilizador', details: error.message });
        }
    },

    consultarPorPOIeUtilizador: async (req, res) => {
        const { idPonto, idUser } = req.params;

        try {
            const itemAvaliacao = await models.itemavaliacao.findOne({
                where: {
                    itemorigid: idPonto,
                    tipoentidade: 'POI'
                }
            });

            if (!itemAvaliacao){
                return res.status(200).json({ message: 'Consulta realizada com sucesso', data: 0 });
            }

            const avaliacao = await models.avaliacao.findOne({
                where: {
                    itemavaliacaoid: itemAvaliacao.itemavaliacaoid,
                    utilizadorid: idUser
                },
                order: [['datacriacao', 'DESC']]
            });

            res.status(200).json({ message: 'Consulta realizada com sucesso', data: avaliacao || 0 });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar utilizador', details: error.message });
        }
    },
};

module.exports = avaliacaoController;
