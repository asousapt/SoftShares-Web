const { Sequelize, Op, where } = require('sequelize');
const initModels = require('../models/init-models');
const sequelizeConn = require('../bdConexao');
const models = initModels(sequelizeConn);

const controladorMensagem = {
    adicionar: async (req, res) => {
        const { idRemetente, idDestinatario, tipoDestinatario, mensagem, imagens} = req.body;

        try{
            const destinatario = await models.destinatario.findOne({
                where: {
                    itemdestinatario: idDestinatario,
                    tipo: tipoDestinatario
                }
            });

            const mensagemRtn = await models.mensagem.create({
                destinatarioid: destinatario.destinatarioid,
                mensagem: mensagem,
                remententeid: idRemetente
            });

            await models.objecto.create({
                registoid: mensagemRtn.mensagemid,
                entidade: 'MENSAGEM'
            });
            
            ficheirosController.adicionar(mensagemRtn.mensagemid, 'MENSAGEM', imagens, idRemetente);
            
            res.status(201).json({ message: 'Mensagem adicionada com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao adicionar mensagem', details: error.message });
        }
    },

    remover: async (req, res) => {
        const { id } = req.params;
        
        try {
            await models.objecto.destroy({
                where: {
                    registoid: id,
                    entidade: 'MENSAGEM'
                }
            });

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