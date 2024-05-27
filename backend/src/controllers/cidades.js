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
};

module.exports = controladorCidades;