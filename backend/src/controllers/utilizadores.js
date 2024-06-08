const { Sequelize, QueryTypes } = require('sequelize');
const initModels = require('../models/init-models');
const sequelizeConn = require('../bdConexao');
const models = initModels(sequelizeConn);
const { generateToken } = require('../tokenUtils');

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
            sobre,
            inactivo
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
                sobre,
                inactivo
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

    consultarPorEmail: async (req, res) => {
        const { email } = req.params;
    
        try {
            const utilizador = await models.utilizador.findOne({
                where: {
                    email: email
                },
                include: {
                    model: models.perfil,
                    as: 'perfil'
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

    consultarTotalPorPolo: async (req, res) => {
        try {
            const totalPorPolo = await sequelizeConn.query(
                `SELECT 
                    pol.descricao AS label, 
                    COUNT(u.utilizadorid) AS value
                FROM 
                    utilizador u
                LEFT JOIN 
                    polo pol ON u.poloid = pol.poloid
                GROUP BY 
                    pol.descricao`,
                { type: QueryTypes.SELECT }
            );
    
            // atribuir cores aos polos
            const colors = ['#7cb342', '#ffca28', '#ff7043', '#ab47bc', '#42a5f5', '#66bb6a', '#26a69a', '#ef5350', '#ec407a', '#ab47bc'];
            totalPorPolo.forEach((item, index) => {
                item.color = colors[index % colors.length];
            });
    
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: totalPorPolo });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar utilizadores por polo', details: error.message });
        }
    },

    consultarTodosComFiltro: async (req, res) => {
        const { estado, descricao } = req.query;
        try {
            let whereClause = '';
            if (estado !== undefined) {
                whereClause += ` AND u.inactivo = ${estado}`;
            }

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
                    traducao func ON ch_func.chaveid = func.chaveid AND func.idiomaid = 1
                WHERE
                    CONCAT(u.pnome, ' ', u.unome) LIKE '%${descricao}%'
                ${whereClause}
                    `,
                { type: QueryTypes.SELECT }
            );
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: utilizadors });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar utilizadores', details: error.message });
        }
    },  

    novoToken: async (req, res) => {
        const { id} = req.params;
        try {
            const utilizador = await models.utilizador.findByPk(id);

            const token = generateToken(utilizador);
            console.log(token);
            res.status(200).json(token);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar utilizadores', details: error.message });
        }
    },    
};

module.exports = controladorUtilizadores;