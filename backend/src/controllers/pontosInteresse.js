const { Sequelize, Op } = require('sequelize');
const initModels = require('../models/init-models');
const sequelizeConn = require('../bdConexao');
const models = initModels(sequelizeConn);

const controladorPontosInteresse = {
    adicionar: async (req, res) => {
        const {
            subcategoriaid,
            titulo,
            descricao,
            localizacao,
            latitude,
            longitude,
            idiomaid,
            cidadeid,
            utilizadorcriou
        } = req.body;

        try {
            await models.pontointeresse.create({
                subcategoriaid: subcategoriaid,
                titulo: titulo,
                descricao: descricao,
                localizacao: localizacao,
                latitude: latitude,
                longitude: longitude,
                idiomaid: idiomaid,
                cidadeid: cidadeid,
                utilizadorcriou: utilizadorcriou
            });

            res.status(201).json({ message: 'Ponto de interesse adicionado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao adicionar ponto de interesse', details: error.message });
        }
    },

    atualizar: async (req, res) => {
        const { idPontoInteresse } = req.params;
        const {
            subcategoriaid,
            titulo,
            descricao,
            localizacao,
            latitude,
            longitude,
            idiomaid,
            cidadeid,
            utilizadorcriou
        } = req.body;

        try {
            await models.pontointeresse.update({
                subcategoriaid: subcategoriaid,
                titulo: titulo,
                descricao: descricao,
                localizacao: localizacao,
                latitude: latitude,
                longitude: longitude,
                idiomaid: idiomaid,
                cidadeid: cidadeid,
                utilizadorcriou: utilizadorcriou
            }, {
                where: {
                    pontointeresseid: idPontoInteresse
                }
            });

            res.status(200).json({ message: 'Ponto de interesse atualizado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar ponto de interesse', details: error.message });
        }
    },

    aprovar: async (req, res) => {
        const { idPontoInteresse } = req.params;
        const { userAprovacao } = req.body;
        try {
            await models.pontointeresse.update({
                aprovado: true,
                dataaprovacao: Sequelize.literal('CURRENT_DATE'),
                utilizadoraprova: userAprovacao
            }, {
                where: {
                    pontointeresseid: idPontoInteresse
                }
            });

            res.status(200).json({ message: 'Ponto de interesse aprovado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao aprovar ponto de interesse', details: error.message });
        }
    },

    rejeitar: async (req, res) => {
        const { idPontoInteresse } = req.params;
        try {
            await models.pontointeresse.update({
                aprovado: false
            }, {
                where: {
                    pontointeresseid: idPontoInteresse
                }
            });

            res.status(200).json({ message: 'Ponto de interesse rejeitado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao rejeitar ponto de interesse', details: error.message });
        }
    },

    remover: async (req, res) => {
        const { idPontoInteresse } = req.params;

        try {
            await models.pontointeresse.destroy({
                where: {
                    pontointeresseid: idPontoInteresse
                }
            });

            res.status(200).json({ message: 'Ponto de interesse removido com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao remover ponto de interesse', details: error.message });
        }
    },

    consultarTudo: async (req, res) => {
        try {
            const pontosInteresse = await models.pontointeresse.findAll();
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: pontosInteresse });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar os pontos de interesse', details: error.message });
        }
    },

    consultarPorSubcategoria: async (req, res) => {
        const { idSubCat } = req.params;

        try {
            const pontosInteresse = await models.pontointeresse.findAll({
                where:{
                    subcategoriaid: idSubCat
                }
            });
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: pontosInteresse });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar os pontos de interesse', details: error.message });
        }
    }
};

module.exports = controladorPontosInteresse;
