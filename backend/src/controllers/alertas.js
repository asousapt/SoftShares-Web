const { Sequelize, Op } = require('sequelize');
const initModels = require('../models/init-models');
const sequelizeConn = require('../bdConexao');
const models = initModels(sequelizeConn);

const controladorAlertas = {
    adicionarAlerta: async (req, res) => {
        const { utilizadorID, texto, poloID } = req.body;

        try {
            const idioma = await models.idioma.findOne({
                where: {
                    icone: 'pt'
                }
            });

            await models.alerta.create({
                utilizadorid: utilizadorID,
                texto: texto,
                idiomaid: idioma.idiomaid,
                poloid: poloID
            });

            res.status(201).json({ message: 'Alerta adicionado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao adicionar alerta', details: error.message });
        }
    },

    atualizarAlerta: async (req, res) => {
        const { idAlerta } = req.params;
        const { texto, poloID, inactivo } = req.body;
        try {
            await models.alerta.update({
                texto: texto,
                poloid: poloID,
                inactivo: inactivo
            }, {
                where: {
                    alertaid: idAlerta
                }
            });

            res.status(200).json({ message: 'Alerta atualizado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar alerta', details: error.message });
        }
    },

    consultarAlerta: async (req, res) => {
        const { idAlerta } = req.params;

        try {
            const alerta = await models.alerta.findOne({
                where: {
                    alertaid: idAlerta
                },
                include: [
                    {
                        model: models.utilizador,
                        as: 'utilizador',
                        attributes: ['pnome', 'unome']
                    }
                ]
            });
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: alerta });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar o alerta', details: error.message });
        }
    },
    
    inativarAlerta: async (req, res) => {
        const { idAlerta } = req.params;

        try {
            await models.alerta.update({
                inactivo: true
            }, {
                where: {
                    alertaID: idAlerta
                }
            });

            res.status(200).json({ message: 'Alerta cancelado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao cancelar alerta', details: error.message });
        }
    },

    removerAlerta: async (req, res) => {
        const { idAlerta } = req.params;

        try {
            await models.alerta.destroy({
                where: {
                    alertaID: idAlerta
                }
            });

            res.status(200).json({ message: 'Alerta removido com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao remover alerta', details: error.message });
        }
    },

    consultarAlertaPorPolo: async (req, res) => {
        const { idPolo } = req.params;

        try {
            const alerta = await models.alerta.findAll({
                where: {
                    poloid: idPolo
                }
            });
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: alerta });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar o alerta', details: error.message });
        }
    },

    consultarTudo: async (req, res) => {
        try {
            const alertas = await models.alerta.findAll({
                include: [
                    {
                        model: models.utilizador,
                        as: 'utilizador',
                        attributes: ['pnome', 'unome']
                    }
                ]
            });
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: alertas });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar os alertas', details: error.message });
        }
    },

    consultarTudoComFiltros: async (req, res) => {
        const {estado, descricao, poloid} = req.query;

        try {
            const alertas = await models.alerta.findAll({
                include: [
                    {
                        model: models.utilizador,
                        as: 'utilizador',
                        attributes: ['pnome', 'unome']
                    }
                ],
                where: {
                    texto: { [Op.like]: `%${descricao}%` },
                    ...(estado !== undefined && { inactivo: estado }),
                    ...(poloid && { poloid: poloid })
                },
                
            });
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: alertas });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar os alertas', details: error.message });
        }
    }, 
    consultarAlertasPoloidiomaMobile: async (req, res) => {
        const {idPolo, idiomaid} = req.params;
        try {
            const alertas = await models.alerta.findAll({
                where: {
                    poloid: idPolo,
                    idiomaid: idiomaid, 
                    inactivo: false
                }
            });
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: alertas });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar os alertas vvvv', details: error.message });
        }
    }
    
};

module.exports = controladorAlertas;
