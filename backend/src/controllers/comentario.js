const { Sequelize, Op } = require('sequelize');
const initModels = require('../models/init-models');
const sequelizeConn = require('../bdConexao');
const models = initModels(sequelizeConn);

const comentarioController = {
    adicionar: async (req, res) => {
        const { itemcomentarioid, utilizadorid, comentario } = req.body;

        try {
            await models.comentario.create({
                itemcomentarioid: itemcomentarioid,
                utilizadorid: utilizadorid,
                comentario: comentario
            });

            res.status(201).json({ message: 'Comentário adicionado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao adicionar comentário', details: error.message });
        }
    },

    atualizar: async (req, res) => {
        const { idComentario } = req.params;
        const { comentario } = req.body;

        try {
            await models.comentario.update({
                comentario: comentario
            }, {
                where: {
                    comentarioid: idComentario
                }
            });

            res.status(200).json({ message: 'Comentário atualizado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar comentário', details: error.message });
        }
    },

    remover: async (req, res) => {
        const { idComentario } = req.params;

        try {
            await models.comentario.destroy({
                where: {
                    comentarioid: idComentario
                }
            });

            res.status(200).json({ message: 'Comentário removido com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao remover comentário', details: error.message });
        }
    },

    consultarTudo: async (req, res) => {
        try {
            const comentarios = await models.comentario.findAll();
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: comentarios });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar comentários', details: error.message });
        }
    },

    consultarComentario: async (req, res) => {
        const { idItemComentario } = req.params;

        try {
            const comentarios = await models.comentario.findAll({
                where: {
                    itemcomentarioid: idItemComentario
                }
            });
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: comentarios });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar comentários por item de comentário', details: error.message });
        }
    }
};

module.exports = comentarioController;
