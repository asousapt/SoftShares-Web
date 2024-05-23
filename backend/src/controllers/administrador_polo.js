const { Sequelize, QueryTypes } = require('sequelize');
const initModels = require('../models/init-models');
const sequelizeConn = require('../bdConexao');
const models = initModels(sequelizeConn);

const administradorPoloController = {
    adicionar: async (req, res) => {
        const { utilizadorid, poloid } = req.body;

        try {
            const administradorPolo = await models.administrador_polo.create({
                utilizadorid: utilizadorid,
                poloid: poloid,
            });

            res.status(201).json({ message: 'Administrador de polo adicionado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao adicionar administrador de polo', details: error.message });
        }
    },

    atualizar: async (req, res) => {
        const { idAdminPolo } = req.params;
        const { utilizadorid, poloid } = req.body;

        try {
            const administradorPolo = await models.administrador_polo.findByPk(idAdminPolo);
            if (!administradorPolo) {
                return res.status(404).json({ error: 'Administrador de polo não encontrado' });
            }

            await models.administrador_polo.update({
                utilizadorid: utilizadorid,
                poloid: poloid
            }, {
                where: {
                    administrador_poloid: idAdminPolo
                }
            });

            res.status(200).json({ message: 'Administrador de polo atualizado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar administrador de polo', details: error.message });
        }
    },

    remover: async (req, res) => {
        const { idAdminPolo } = req.params;

        try {
            const administradorPolo = await models.administrador_polo.findByPk(idAdminPolo);
            if (!administradorPolo) {
                return res.status(404).json({ error: 'Administrador de polo não encontrado' });
            }

            await models.administrador_polo.destroy({
                where: {
                    administrador_poloid: idAdminPolo
                }
            });

            res.status(200).json({ message: 'Administrador de polo removido com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao remover administrador de polo', details: error.message });
        }
    },

    listar: async (req, res) => {
        try {
            const administradoresPolo = await models.administrador_polo.findAll();
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: administradoresPolo });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao listar administradores de polo', details: error.message });
        }
    },

    consultarPorId: async (req, res) => {
        const { idAdminPolo } = req.params;

        try {
            const administradorPolo = await models.administrador_polo.findByPk(idAdminPolo);
            if (!administradorPolo) {
                return res.status(404).json({ error: 'Administrador de polo não encontrado' });
            }

            res.status(200).json({ message: 'Consulta realizada com sucesso', data: administradorPolo });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar administrador de polo', details: error.message });
        }
    },
};

module.exports = administradorPoloController;
