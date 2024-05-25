const { Sequelize, QueryTypes } = require('sequelize');
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
            const utilizadors = await sequelizeConn.query(
                `SELECT 
                    u.*, 
                    perf.descricao AS descricao_perfil,
                    pol.descricao AS descricao_polo,
                    dep.valor AS descricao_departamento,
                    func.valor AS descricao_funcao
                FROM 
                    utilizador u
                LEFT JOIN 
                    perfil perf ON u.perfilid = perf.perfilid
                LEFT JOIN 
                    polo pol ON u.poloid = pol.poloid
                INNER JOIN 
                    chave ch_dep ON u.departamentoid = ch_dep.registoid AND ch_dep.entidade = 'DEPARTAMENTO'
                LEFT JOIN 
                    traducao dep ON ch_dep.chaveid = dep.chaveid AND dep.idiomaid = 1
                INNER JOIN 
                    chave ch_func ON u.funcaoid = ch_func.registoid AND ch_func.entidade = 'FUNCAO'
                LEFT JOIN 
                    traducao func ON ch_func.chaveid = func.chaveid AND func.idiomaid = 1`,
                { type: QueryTypes.SELECT }
            );
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: utilizadors });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar utilizadores', details: error.message });
        }
    },
};

module.exports = controladorUtilizadores;