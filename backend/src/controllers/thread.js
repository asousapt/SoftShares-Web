const { Sequelize, QueryTypes } = require('sequelize');
const initModels = require('../models/init-models');
const sequelizeConn = require('../bdConexao');
const utilizador = require('../models/utilizador');
const models = initModels(sequelizeConn);

const controladorThread = {
    adicionar: async (req, res) => {
        const { subcategoriaid, utilizadorid, titulo, mensagem, idiomaid } = req.body;

        try {
            const thread = await models.thread.create({
                subcategoriaid: subcategoriaid,
                utilizadorid: utilizadorid,
                titulo: titulo,
                mensagem: mensagem,
                idiomaid: idiomaid
            });

            await models.objecto.create({
                registoid: thread.threadid,
                entidade: 'THREAD'
            });

            res.status(201).json({ message: 'Thread adicionada com sucesso', data: thread });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao adicionar thread', details: error.message });
        }
    },

    atualizar: async (req, res) => {
        const { id } = req.params;
        const { titulo, mensagem, aprovado, utilizadoraprovou, dataaprovacao, inactivo } = req.body;

        try {
            const thread = await models.thread.findByPk(id);
            if (!thread) {
                return res.status(404).json({ error: 'Thread não encontrada' });
            }

            await models.thread.update({
                titulo: titulo,
                mensagem: mensagem,
                utilizadoraprovou: utilizadoraprovou,
                dataaprovacao: dataaprovacao,
                inactivo: inactivo
            }, {
                where: {
                    threadid: id
                }
            });

            res.status(200).json({ message: 'Thread atualizada com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar thread', details: error.message });
        }
    },

    remover: async (req, res) => {
        const { id } = req.params;

        try {
            const thread = await models.thread.findByPk(id);
            if (!thread) {
                return res.status(404).json({ error: 'Thread não encontrada' });
            }

            await models.objecto.destroy({
                where: {
                    registoid: id,
                    entidade: 'THREAD'
                }
            });

            await models.thread.destroy({
                where: {
                    threadid: id
                }
            });

            res.status(200).json({ message: 'Thread removida com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao remover thread', details: error.message });
        }
    },

    consultarPorSubcategoria: async (req, res) => {
        const { subcategoriaid } = req.params;

        try {
            const threads = await models.thread.findAll({
                where: {
                    subcategoriaid: subcategoriaid
                }
            });

            res.status(200).json({ message: 'Consulta realizada com sucesso', data: threads });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar threads por subcategoria', details: error.message });
        }
    },

    consultarTodos: async (req, res) => {
        try {
            const thread = await models.thread.findAll({
                include: [
                    {
                        model: models.utilizador,
                        as: 'utilizador',
                        attributes: ['pnome', 'unome']
                    }
                ]
            });
    
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: thread });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar utilizador', details: error.message });
        }
    }
    
};

module.exports = controladorThread;
