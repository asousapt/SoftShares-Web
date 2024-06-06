const { Sequelize, Op } = require('sequelize');
const initModels = require('../models/init-models');
const sequelizeConn = require('../bdConexao');
const models = initModels(sequelizeConn);

const controladorCidades = {
    consultarTodos: async (req, res) => {
        try {
            const cidade = await models.cidade.findAll();
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: cidade });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar utilizador', details: error.message });
        }
    },

    consultarTodosDistritos: async (req, res) => {
        try {
            const distrito = await models.distrito.findAll();
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: distrito });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar utilizador', details: error.message });
        }
    },

    consultarCidadesDistrito: async (req, res) => {
        try {
            const { distritoId } = req.params;
            const cidades = await models.cidade.findAll({
                where: { distritoid: distritoId }
            });
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: cidades });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar cidades por distrito', details: error.message });
        }
    },

    consultarDistritoCidade: async (req, res) => {
        try {
            const { cidadeId } = req.params;
            const cidade = await models.cidade.findOne({
                where: { cidadeid: cidadeId },
                include: [{ model: models.distrito, as: 'distrito' }]
            });

            if (!cidade) {
                return res.status(404).json({ message: 'Cidade não encontrada' });
            }

            res.status(200).json({ message: 'Consulta realizada com sucesso', data: cidade.distrito });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar distrito por cidade', details: error.message });
        }
    },
};

module.exports = controladorCidades;