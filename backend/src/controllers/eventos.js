const { Sequelize, Op } = require('sequelize');
const initModels = require('../models/init-models');
const sequelizeConn = require('../bdConexao');
const evento = require('../models/evento');
const models = initModels(sequelizeConn);

const controladorEventos = {
    adicionarEvento: async (req, res) => {
        const { titulo, descricao, dataInicio, dataFim, dataLimInscricao, nmrMaxParticipantes, localizacao, latitude, longitude, cidadeID, utilizadorCriou } = req.body;

        try {
            await models.evento.create({
                titulo: titulo,
                descricao: descricao,
                dataInicio: dataInicio,
                dataFim: dataFim,
                dataLimInscricao: dataLimInscricao,
                nmrMaxParticipantes: nmrMaxParticipantes,
                localizacao: localizacao,
                latitude: latitude,
                longitude: longitude,
                cidadeID: cidadeID,
                utilizadorCriou: utilizadorCriou
            });
            
            res.status(201).json({ message: 'Evento adicionado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao adicionar evento' });
        }
    },

    atualizarEvento: async (req, res) => {
        const { idEvento } = req.params;
        const { titulo, descricao, dataInicio, dataFim, dataLimInscricao, nmrMaxParticipantes, localizacao, latitude, longitude, cidadeID } = req.body;

        try {
            await models.evento.update({
                titulo: titulo,
                descricao: descricao,
                dataInicio: dataInicio,
                dataFim: dataFim,
                dataLimInscricao: dataLimInscricao,
                nmrMaxParticipantes: nmrMaxParticipantes,
                localizacao: localizacao,
                latitude: latitude,
                longitude: longitude,
                cidadeID: cidadeID
            }, {
                where: {
                    eventoid: idEvento
                }
            });

            res.status(200).json({ message: 'Evento atualizado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar evento' });
        }
    },

    aprovarEvento: async (req, res) => {
        const { idEvento, idUser } = req.params;

        try {
            await models.evento.update({
                aprovado: 1,
                utilizadoraprovou: idUser,
                dataaprovacao: Sequelize.literal('CURRENT_DATE')
            }, {
                where: {
                    eventoid: idEvento
                }
            });
            res.status(200).json({ message: 'Evento aprovado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao aprovar o evento' });
        }
    },

    cancelarEvento: async (req, res) => {
        const { idEvento } = req.params;

        try {
            await models.evento.update({
                cancelado: 1
            }, {
                where: {
                    eventoid: idEvento
                }
            });
            res.status(200).json({ message: 'Evento cancelado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao cancelar o evento' });
        }
    },

    consultarEventoPorID: async (req, res) => {
        const { idEvento } = req.params;

        try {
            const evento = await models.evento.findByPk(idEvento);
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: evento });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar o evento' });
        }
    },

    consultarEventosEntreDatas: async (req, res) => {
        const { poloID, data1, data2 } = req.params;

        try {
            const eventos = await models.evento.findAll({
                where: {
                    [Op.and]: [
                        {dataInicio: {[Op.between]: [data1, data2]}},
                        Sequelize.literal(`cidadeID IN (SELECT CIDADEID FROM POLO WHERE POLOID = ${poloID})`)
                    ]
                }
            })
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: eventos });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar os eventos' });
        }
    }
};

module.exports = controladorEventos;
