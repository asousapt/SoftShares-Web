const { Sequelize, Op } = require('sequelize');
const initModels = require('../models/init-models');
const sequelizeConn = require('../bdConexao');
const models = initModels(sequelizeConn);

const controladorPolos = {
    adicionarPolo: async (req, res) => {
        const { cidadeID, descricao, morada, email, telefone, coordenador } = req.body;

        try {
            await models.polo.create({
                cidadeid: cidadeID,
                descricao: descricao,
                morada: morada,
                email: email,
                telefone: telefone,
                coordenador: coordenador
            });

            res.status(201).json({ message: 'Polo adicionado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao adicionar polo', details: error.message });
        }
    },

    atualizarPolo: async (req, res) => {
        const { idPolo } = req.params;
        const { cidadeID, descricao, morada, email, telefone, coordenador } = req.body;

        try {
            await models.polo.update({
                cidadeid: cidadeID,
                descricao: descricao,
                morada: morada,
                email: email,
                telefone: telefone,
                coordenador: coordenador
            }, {
                where: {
                    poloid: idPolo
                }
            });

            res.status(200).json({ message: 'Polo atualizado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar polo' });
        }
    },

    apagarPolo: async (req, res) => {
        const { idPolo } = req.params;

        try {
            await models.polo.destroy({
                where: {
                    poloid: idPolo
                }
            });

            res.status(200).json({ message: 'Polo cancelado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao cancelar polo' });
        }
    },

    consultarPoloPorID: async (req, res) => {
        const { idPolo } = req.params;

        try {
            const polo = await models.polo.findByPk(idPolo);
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: polo });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar o polo' });
        }
    },

    consultarTodos: async (req, res) => {
        try {
            const polo = await models.polo.findAll();
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: polo });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar polo', details: error.message });
        }
    },

};

module.exports = controladorPolos;
