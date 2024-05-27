const { Sequelize, Op } = require('sequelize');
const initModels = require('../models/init-models');
const sequelizeConn = require('../bdConexao');
const models = initModels(sequelizeConn);

const controladorUtilizadores = {
    adicionar: async (req, res) => {
        const {
            poloid,
            perfilid,
            pnome,
            unome,
            email,
            passwd,
            chavesalt,
            idiomaid,
            departamentoid,
            funcaoid,
            sobre
        } = req.body;

        try {
            const user = await models.utilizador.create({
                poloid,
                perfilid,
                pnome,
                unome,
                email,
                passwd,
                chavesalt,
                idiomaid,
                departamentoid,
                funcaoid,
                sobre
            });

            await models.destinatario.create({
                itemdestinatario: user.utilizadorid,
                tipo: 'UT'
            });

            await models.objecto.create({
                registoid: user.userid,
                entidade: 'USER'
            });

            res.status(201).json({ message: 'Utilizador adicionado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao adicionar utilizador', details: error.message });
        }
    },

    atualizar: async (req, res) => {
        const { idUtilizador } = req.params;
        const {
            poloid,
            perfilid,
            pnome,
            unome,
            email,
            passwd,
            chavesalt,
            idiomaid,
            departamentoid,
            funcaoid,
            sobre
        } = req.body;

        try {
            await models.utilizador.update({
                poloid,
                perfilid,
                pnome,
                unome,
                email,
                passwd,
                chavesalt,
                idiomaid,
                departamentoid,
                funcaoid,
                sobre
            }, {
                where: {
                    utilizadorid: idUtilizador
                }
            });

            res.status(200).json({ message: 'Utilizador atualizado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar utilizador', details: error.message });
        }
    },

    remover: async (req, res) => {
        const { idUtilizador } = req.params;

        try {
            await models.objecto.destroy({
                where: {
                    registoid: idUtilizador,
                    entidade: 'USER'
                }
            });

            await models.destinatario.destroy({
                where: {
                    itemdestinatario: idUtilizador,
                    tipo: 'UT'
                }
            });

            await models.utilizador.destroy({
                where: {
                    utilizadorid: idUtilizador
                }
            });

            res.status(200).json({ message: 'Utilizador removido com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao remover utilizador', details: error.message });
        }
    },

    consultarUtilizador: async (req, res) => {
        const { idUtilizador } = req.params;

        try {
            const utilizador = await models.utilizador.findByPk(idUtilizador, {
                include: {
                    model: models.perfil,
                    as: 'perfil',
                    attributes: ['descricao']
                }
            });

            if (!utilizador) {
                return res.status(404).json({ error: 'Utilizador não encontrado' });
            }

            res.status(200).json({ message: 'Consulta realizada com sucesso', data: utilizador });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar utilizador', details: error.message });
        }
    },

    consultarTodos: async (req, res) => {
        try {
            const utilizadors = await models.utilizador.findAll({
                include: [
                    {
                        model: models.perfil,
                        as: 'perfil',
                        attributes: ['descricao']
                    },
                ]
            });
    
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: utilizadors });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar utilizadores', details: error.message });
        }
    },
};

module.exports = controladorUtilizadores;
