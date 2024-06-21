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
                    p.pontointeresseid AS pontointeresseid,
                    p.titulo AS poi_titulo,
                    p.descricao AS poi_descricao,
                    p.aprovado AS poi_aprovado,
                    p.dataaprovacao AS poi_dataaprovacao,
                    p.utilizadoraprova AS poi_utilizadoraprova,
                    p.localizacao AS poi_localizacao,
                    p.latitude AS poi_latitude,
                    p.longitude AS poi_longitude,
                    p.idiomaid AS poi_idiomaid,
                    p.cidadeid AS poi_cidadeid,
                    p.datacriacao AS poi_datacriacao,
                    p.dataalteracao AS poi_dataalteracao,
                    p.utilizadorcriou AS poi_utilizadorcriou,
                    c1.comentarioid AS comentarioid,
                    c1.itemcomentarioid AS itemcomentarioid,
                    c1.utilizadorid AS utilizadorid,
                    c1.comentario AS comentario,
                    c1.datacriacao AS comentario_datacriacao,
                    c1.dataalteracao AS comentario_dataalteracao,
                    ic.tipo AS tipo,
                    cr.comentariopaiid AS parent_comentarioid,
                    c2.comentarioid AS resposta_comentarioid,
                    c2.comentario AS resposta_comentario,
                    c2.datacriacao AS resposta_datacriacao,
                    c2.dataalteracao AS resposta_dataalteracao
                FROM 
                    pontointeresse p
                LEFT JOIN
                    itemcomentario ic ON p.pontointeresseid = ic.registoid AND ic.tipo = 'POI'
                LEFT JOIN
                    comentario c1 ON ic.itemcomentarioid = c1.itemcomentarioid
                LEFT JOIN
                    comentarioresposta cr ON c1.comentarioid = cr.comentariopaiid
                LEFT JOIN
                    comentario c2 ON cr.respostaid = c2.comentarioid
                `,
                { type: QueryTypes.SELECT }
            );
    
            // Helper function to build the nested comments structure
            const buildNestedComments = (comments) => {
                const commentMap = {};
                const responseSet = new Set(); // To track which comments are responses
    
                comments.forEach(comment => {
                    if (!commentMap[comment.comentarioid]) {
                        commentMap[comment.comentarioid] = {
                            comentarioid: comment.comentarioid,
                            comentario: comment.comentario,
                            tipo: comment.tipo,
                            respostas: []
                        };
                    }
    
                    if (comment.resposta_comentarioid) {
                        if (!commentMap[comment.resposta_comentarioid]) {
                            commentMap[comment.resposta_comentarioid] = {
                                comentarioid: comment.resposta_comentarioid,
                                comentario: comment.resposta_comentario,
                                tipo: 'REPLY',
                                respostas: []
                            };
                        }
                        commentMap[comment.comentarioid].respostas.push(commentMap[comment.resposta_comentarioid]);
                        responseSet.add(comment.resposta_comentarioid); // Mark as a response
                    }
                });
    
                // Return only the root comments
                return Object.values(commentMap).filter(comment => !responseSet.has(comment.comentarioid));
            };
    
            // Map to hold POIs with their comments
            const poiMap = {};
    
            comentarios.forEach(row => {
                if (!poiMap[row.pontointeresseid]) {
                    poiMap[row.pontointeresseid] = {
                        pontointeresseid: row.pontointeresseid,
                        titulo: row.poi_titulo,
                        descricao: row.poi_descricao,
                        aprovado: row.poi_aprovado,
                        dataaprovacao: row.poi_dataaprovacao,
                        utilizadoraprova: row.poi_utilizadoraprova,
                        localizacao: row.poi_localizacao,
                        latitude: row.poi_latitude,
                        longitude: row.poi_longitude,
                        idiomaid: row.poi_idiomaid,
                        cidadeid: row.poi_cidadeid,
                        datacriacao: row.poi_datacriacao,
                        dataalteracao: row.poi_dataalteracao,
                        utilizadorcriou: row.poi_utilizadorcriou,
                        comentarios: []
                    };
                }
    
                // Add comment to the respective POI
                if (row.comentarioid) {
                    const comment = {
                        comentarioid: row.comentarioid,
                        comentario: row.comentario,
                        tipo: row.tipo,
                        parent_comentarioid: row.parent_comentarioid,
                        resposta_comentarioid: row.resposta_comentarioid,
                        resposta_comentario: row.resposta_comentario
                    };
    
                    poiMap[row.pontointeresseid].comentarios.push(comment);
                }
            });
    
            // Build nested comments for each POI
            Object.values(poiMap).forEach(poi => {
                poi.comentarios = buildNestedComments(poi.comentarios);
            });
    
            // Convert POI map to an array
            const pontosInteresse = Object.values(poiMap);
    
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
