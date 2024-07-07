const { Sequelize, Op, where } = require('sequelize');
const initModels = require('../models/init-models');
const sequelizeConn = require('../bdConexao');
const models = initModels(sequelizeConn);

const controladorNotificacoes = {
    adicionar: async (req, res) => {
        const { idUser, notificacao } = req.body;

        try{
            await models.mensagem.notificacao.create({
                utilizadorid: idUser,
                notificacao: notificacao
            });
            
            res.status(201).json({ message: 'Mensagem adicionada com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao adicionar mensagem', details: error.message });
        }
    },

    marcarLida: async (req, res) => {
        const { id } = req.params;

        try{
            await models.notificacao.update({
                vista: true
            }, {
                where: {
                    notificacaoid: id
                }
            });
            
            res.status(201).json({ message: 'Mensagem lida com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao adicionar mensagem', details: error.message });
        }
    },

    remover: async (req, res) => {
        const { id } = req.params;
        
        try {
            await models.notificacao.destroy({
                where: {
                    mensagemid: id
                }
            });

            res.status(200).json({ message: 'Mensagem removida com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao removida mensagem', details: error.message });
        }
    },

    consultarPorUtilizador: async (req, res) => {
        const { idUser } = req.params;

        try {
            const notificacoes = await models.notificacao.findAll({
                where: {
                    utilizadorid: idUser
                }
            });
            
            res.status(200).json(notificacoes);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar mensagens', details: error.message });
        }
    }, 
    consultarPorUtilizadorActivas: async (req, res) => {
        const { idUser } = req.params;

        try {
            const notificacoes = await models.notificacao.findAll({
                where: {
                    utilizadorid: idUser,
                    vista: false
                }
            });
            
            res.status(200).json({mensagem: "Mensagens não lidas", data: notificacoes});
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar mensagens', details: error.message });
        }
    }
}

module.exports = controladorNotificacoes;