const { Sequelize, Op, QueryTypes } = require('sequelize');
const initModels = require('../models/init-models');
const sequelizeConn = require('../bdConexao');
const models = initModels(sequelizeConn);
const ficheirosController = require('./ficheiros');

const controladorPolos = {
    adicionarPolo: async (req, res) => {
        const { cidadeID, descricao, morada, email, telefone, coordenador, imagem, utilizadorid } = req.body;

        try {
            const polo = await models.polo.create({
                cidadeid: cidadeID,
                descricao: descricao,
                morada: morada,
                email: email,
                telefone: telefone,
                coordenador: coordenador
            });

            await models.objecto.create({
                registoid: polo.poloid,
                entidade: 'POLO'
            });

            ficheirosController.adicionar(polo.poloid, 'POLO', imagem, utilizadorid);

            res.status(201).json({ message: 'Polo adicionado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao adicionar polo', details: error.message });
        }
    },

    atualizarPolo: async (req, res) => {
        const { idPolo } = req.params;
        const { cidadeID, descricao, morada, email, telefone, coordenador, imagem, utilizadorid } = req.body;
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

            ficheirosController.removerTodosFicheirosAlbum(idPolo, 'POLO')
            ficheirosController.adicionar(idPolo, 'POLO', imagem, utilizadorid);

            res.status(200).json({ message: 'Polo atualizado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar polo' });
        }
    },

    apagarPolo: async (req, res) => {
        const { idPolo } = req.params;

        try {
            await models.objecto.destroy({
                where: {
                    registoid: idPolo,
                    entidade: 'POLO'
                }
            });

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
            
            if (!polo) {
                return res.status(404).json({ error: 'Polo não encontrado' });
            }

            const ficheiros = await ficheirosController.getAllFilesByAlbum(idPolo, 'POLO');
            polo.dataValues.imagem = ficheiros[0];
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: polo });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar o polo' });
        }
    },

    consultarTodos: async (req, res) => {
        try {
            const polos = await sequelizeConn.query(
                `SELECT 
                    p.poloid,
                    p.descricao,
                    p.coordenador, 
                    c.nome as cidade,   
                    COUNT(u.*) AS numusers
                FROM 
                    polo p
                INNER JOIN 
                    cidade c ON p.cidadeid = c.cidadeid
                LEFT JOIN 
                    utilizador u ON p.poloid = u.poloid 
                GROUP BY
                    p.poloid,
                    p.descricao, 
                    c.nome`,
                { type: QueryTypes.SELECT }
            );
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: polos });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar polo', details: error.message });
        }
    },

    consultarTodosMobile: async (req, res) => {
        try {
            const polos = await sequelizeConn.query(
                `SELECT 
                    p.poloid,
                    p.descricao,
                    p.coordenador, 
                    c.nome as cidade,   
                    p.cidadeid
                FROM 
                    polo p
                INNER JOIN 
                    cidade c ON p.cidadeid = c.cidadeid`,
                { type: QueryTypes.SELECT }
            );
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: polos });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar polo', details: error.message });
        }
    },

    consultarTodosComFiltro: async (req, res) => {
        const { descricao } = req.query;
        try {
            const polos = await sequelizeConn.query(
                `SELECT 
                    p.poloid,
                    p.descricao,
                    p.coordenador, 
                    c.nome as cidade,
                    COUNT(u.*) AS numusers
                FROM 
                    polo p
                INNER JOIN 
                    cidade c ON p.cidadeid = c.cidadeid
                LEFT JOIN 
                    utilizador u ON p.poloid = u.poloid 
                WHERE
                    p.descricao LIKE '%${descricao}%'
                GROUP BY
                    p.poloid,
                    p.descricao, 
                    c.nome`,
                { type: QueryTypes.SELECT }
            );
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: polos });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar polo', details: error.message });
        }
    }
};

module.exports = controladorPolos;
