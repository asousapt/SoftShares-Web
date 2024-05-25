const { Sequelize, Op, where } = require('sequelize');
const initModels = require('../models/init-models');
const sequelizeConn = require('../bdConexao');
const models = initModels(sequelizeConn);

const controladorMensagem = {
    adicionar: async (req, res) => {
        const { idRemetente, idDestinatario, tipoDestinatario, mensagem} = req.body;

        try{
            const destinatario = await models.destinatario.findOne({
                where: {
                    itemdestinatario: idDestinatario,
                    tipo: tipoDestinatario
                }
            });

            await models.mensagem.create({
                destinatarioid: destinatario.destinatarioid,
                mensagem: mensagem,
                remententeid: idRemetente
            });
            
            res.status(201).json({ message: 'Mensagem adicionada com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao adicionar mensagem', details: error.message });
        }
    },

    atualizar: async (req, res) => {
        const { id } = req.params;
        const { mensagem } = req.body;

        try {
            await models.mensagem.update({
                mensagem: mensagem
            }, {
                where: {
                    mensagemid: id
                }
            });

            res.status(200).json({ message: 'Mensagem atualizada com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar mensagem', details: error.message });
        }
    },

    remover: async (req, res) => {
        const { id } = req.params;
        
        try {
            await models.mensagem.destroy({
                where: {
                    mensagemid: id
                }
            });

            res.status(200).json({ message: 'Mensagem removida com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao removida mensagem', details: error.message });
        }
    },

    consultarTudo: async (req, res) => {
        const { idDestinatario, tipoDestinatario } = req.params;

        try {
            const destinatario = await models.destinatario.findOne({
                where: {
                    itemdestinatario: idDestinatario,
                    tipo: tipoDestinatario
                }
            });
            if (!destinatario) {
                return res.status(404).json({ error: 'Destinatário não encontrado' });
            }
    
            const mensagens = await models.mensagem.findAll({
                where: {
                    destinatarioid: destinatario.destinatarioid
                }
            });
    
            res.status(200).json(mensagens);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar mensagens', details: error.message });
        }
    }
}

module.exports = controladorMensagem;