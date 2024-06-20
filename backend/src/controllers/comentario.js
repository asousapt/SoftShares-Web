const { Sequelize, Op, QueryTypes } = require('sequelize');
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
            const comentarios = await sequelizeConn.query(
                `SELECT
                    p.*, 
                    ic.*,
                    c.*,
                    cr.*
                FROM 
                    pontointeresse p
                LEFT JOIN
                    itemcomentario ic ON p.pontointeresseid = ic.registoid AND ic.tipo = 'POI'
                INNER JOIN
                    comentario c ON ic.itemcomentarioid = c.itemcomentarioid
                LEFT JOIN
                    comentarioresposta cr ON c.comentarioid = cr.comentariopaiid
                `,
                { type: QueryTypes.SELECT }
            );
    
            // Object to hold points of interest with their comments
            let poiCommentsMap = {};
    
            // Iterate through the comments to build the nested structure
            comentarios.forEach(row => {
                // Check if the point of interest exists in the map
                if (!poiCommentsMap[row.pontointeresseid]) {
                    poiCommentsMap[row.pontointeresseid] = {
                        pontointeresseid: row.pontointeresseid,
                        subcategoriaid: row.subcategoriaid,
                        titulo: row.titulo,
                        descricao: row.descricao,
                        aprovado: row.aprovado,
                        dataaprovacao: row.dataaprovacao,
                        utilizadoraprova: row.utilizadoraprova,
                        localizacao: row.localizacao,
                        latitude: row.latitude,
                        longitude: row.longitude,
                        idiomaid: row.idiomaid,
                        cidadeid: row.cidadeid,
                        datacriacao: row.datacriacao,
                        dataalteracao: row.dataalteracao,
                        utilizadorcriou: row.utilizadorcriou,
                        comentarios: []
                    };
                }
    
                // Check if the comment exists in the point of interest's comments list
                let comment = poiCommentsMap[row.pontointeresseid].comentarios.find(c => c.comentarioid === row.comentarioid);
                if (!comment) {
                    comment = {
                        itemcomentarioid: row.itemcomentarioid,
                        registoid: row.registoid,
                        tipo: row.tipo,
                        comentarioid: row.comentarioid,
                        utilizadorid: row.utilizadorid,
                        comentario: row.comentario,
                        datacriacao: row['c.datacriacao'],
                        dataalteracao: row['c.dataalteracao'],
                        respostas: []
                    };
                    poiCommentsMap[row.pontointeresseid].comentarios.push(comment);
                }
    
                // Add the response to the comment if it exists
                if (row.respostaid) {
                    comment.respostas.push({
                        respostaid: row.respostaid,
                        comentariopaiid: row.comentariopaiid
                    });
                }
            });
    
            // Convert the map to an array
            let pontosInteresse = Object.values(poiCommentsMap);
    
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: pontosInteresse });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar comentários', details: error.message });
        }
    },
    

    consultarComentario: async (req, res) => {
        const { idComentario } = req.params;
    
        try {
            const comentarios = await models.comentario.findAll({
                where: {
                    itemcomentarioid: idComentario
                }
            });
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: comentarios });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar comentários por item de comentário', details: error.message });
        }
    },
    
    adicionarItemComentario: async (req, res) => {
        const { registoid, tipo } = req.body;

        try {
            await models.itemcomentario.create({
                registoid: registoid,
                tipo: tipo
            });

            res.status(201).json({ message: 'Item de comentário adicionado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao adicionar item de comentário', details: error.message });
        }
    },

    atualizarItemComentario: async (req, res) => {
        const { idComentario } = req.params;
        const { registoid, tipo } = req.body;

        try {
            await models.itemcomentario.update({
                registoid: registoid,
                tipo: tipo
            }, {
                where: {
                    itemcomentarioid: idComentario
                }
            });

            res.status(200).json({ message: 'Item de comentário atualizado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar item de comentário', details: error.message });
        }
    },

    removerItemComentario: async (req, res) => {
        const { idComentario } = req.params;

        try {
            await models.itemcomentario.destroy({
                where: {
                    itemcomentarioid: idComentario
                }
            });

            res.status(200).json({ message: 'Item de comentário removido com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao remover item de comentário', details: error.message });
        }
    },

    consultarTudoItemComentario: async (req, res) => {
        try {
            const itensComentario = await models.itemcomentario.findAll();
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: itensComentario });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar itens de comentário', details: error.message });
        }
    },

    consultarPorItemComentario: async (req, res) => {
        const { idItemComentario } = req.params;

        try {
            const itensComentario = await models.itemcomentario.findAll({
                where: {
                    registoid: idItemComentario
                }
            });
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: itensComentario });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar itens de comentário por registro', details: error.message });
        }
    }
};

module.exports = comentarioController;
