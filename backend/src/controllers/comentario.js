const { Sequelize, Op, QueryTypes } = require('sequelize');
const initModels = require('../models/init-models');
const sequelizeConn = require('../bdConexao');
const models = initModels(sequelizeConn);
const ficheirosController = require('./ficheiros');

const comentarioController = {
    adicionar: async (req, res) => {
        const { tipo, idRegisto, utilizadorid, comentario, comentarioPai } = req.body;

        try {
            let itemComentario = await models.itemcomentario.findOne({
                where: {
                    registoid: idRegisto,
                    tipo: tipo
                }
            });

            if (!itemComentario) {
                await models.itemcomentario.create({
                    registoid: idRegisto,
                    tipo: tipo
                });
                
                itemComentario = await models.itemcomentario.findOne({
                    where: {
                        registoid: idRegisto,
                        tipo: tipo
                    }
                });
            }

            const comment = await models.comentario.create({
                itemcomentarioid: itemComentario.itemcomentarioid,
                utilizadorid: utilizadorid,
                comentario: comentario
            });

            if (comentarioPai && comentarioPai > 0){
                await models.comentarioresposta.create({
                    respostaid: comment.comentarioid,
                    comentariopaiid: comentarioPai
                })

                const parent = await models.comentario.findByPk(comentarioPai);
                const user = await models.utilizador.findByPk(parent.utilizadorid);

                let msg = ''
                if (tipo === 'POI'){
                    const poi = await models.pontointeresse.findByPk(idRegisto);
                    msg = `${user.pnome} ${user.unome} respondeu ao seu comentario no ponto de interesse ${poi.titulo}`
                } else if (tipo === 'THREAD'){
                    const thread = await models.thread.findByPk(idRegisto);
                    msg = `${user.pnome} ${user.unome} respondeu ao seu comentario na publicação '${thread.titulo}'`
                } else if (tipo === 'EVENTO'){
                    const evento = await models.evento.findByPk(idRegisto);
                    msg = `${user.pnome} ${user.unome} respondeu ao seu comentario no evento ${evento.titulo}`
                }

                await models.notificacao.create({
                    utilizadorid: parent.utilizadorid,
                    notificacao: msg,
                    tipo: tipo,
                    idregisto: idRegisto
                });
            }

            if(!comentarioPai || comentarioPai < 1){
                if (tipo === 'POI'){
                    const poi = await models.pontointeresse.findByPk(idRegisto);
                    const user = await models.utilizador.findByPk(poi.utilizadorcriou);

                    await models.notificacao.create({
                        utilizadorid: poi.utilizadorcriou,
                        notificacao: `${user.pnome} ${user.unome} comentou no ponto de interesse '${poi.titulo}'`,
                        tipo: 'POI',
                        idregisto: idRegisto
                    });
                } else if (tipo === 'THREAD'){
                    const thread = await models.thread.findByPk(idRegisto);
                    const user = await models.utilizador.findByPk(thread.utilizadorid);

                    await models.notificacao.create({
                        utilizadorid: thread.utilizadorid,
                        notificacao: `${user.pnome} ${user.unome} comentou na sua publicação '${thread.titulo}'`,
                        tipo: 'THREAD',
                        idregisto: idRegisto
                    });
                } else if (tipo === 'EVENTO'){
                    const evento = await models.evento.findByPk(idRegisto);
                    const user = await models.utilizador.findByPk(evento.utilizadorcriou);

                    await models.notificacao.create({
                        utilizadorid: evento.utilizadorcriou,
                        notificacao: `${user.pnome} ${user.unome} comentou no seu evento '${evento.titulo}'`,
                        tipo: 'EVENTO',
                        idregisto: idRegisto
                    });
                }
            }

            res.status(201).json({ message: 'Comentário adicionado com sucesso', data: true});
        } catch (error) {
            res.status(500).json({ error: 'Erro ao adicionar comentário', details: error });
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

    consultarComBaseNoItemcomentario: async (req, res) => {
        const { id, tipo } = req.params;
    
        try {
            const comentarios = await sequelizeConn.query(
                `SELECT
                    c1.comentarioid AS comentarioid,
                    c1.itemcomentarioid AS itemcomentarioid,
                    c1.utilizadorid AS utilizadorid,
                    c1.comentario AS comentario,
                    c1.datacriacao AS data,
                    c1.dataalteracao AS comentario_dataalteracao,
                    CONCAT(u1.pnome, ' ', u1.unome) AS comentario_utilizador_nome,
                    cr.comentariopaiid AS parent_comentarioid,
                    c2.comentarioid AS resposta_comentarioid,
                    c2.comentario AS resposta_comentario,
                    c2.datacriacao AS resposta_datacriacao,
                    c2.dataalteracao AS resposta_dataalteracao,
                    c2.utilizadorid AS resposta_utilizadorid,
                    CONCAT(u2.pnome, ' ', u2.unome) AS resposta_utilizador_nome
                FROM 
                    itemcomentario ic
                INNER JOIN
                    comentario c1 ON ic.itemcomentarioid = c1.itemcomentarioid
                INNER JOIN
                    utilizador u1 ON c1.utilizadorid = u1.utilizadorid
                LEFT JOIN
                    comentarioresposta cr ON c1.comentarioid = cr.comentariopaiid
                LEFT JOIN
                    comentario c2 ON cr.respostaid = c2.comentarioid
                LEFT JOIN
                    utilizador u2 ON c2.utilizadorid = u2.utilizadorid
                WHERE
                    ic.tipo = :tipo
                    AND ic.registoid = :id
                `,
                { 
                    type: Sequelize.QueryTypes.SELECT,
                    replacements: { tipo, id }
                }
            );
    
            // Helper function to build the nested comments structure
            const buildNestedComments = async (comments) => {
                const commentMap = {};
                const responseSet = new Set();
    
                for (const comment of comments) {
                    let ficheiros = await ficheirosController.getAllFilesByAlbum(comment.utilizadorid, 'UTIL');
                    let fotoUrl = ficheiros[0] ? ficheiros[0].url : '';
    
                    if (!commentMap[comment.comentarioid]) {
                        commentMap[comment.comentarioid] = {
                            comentarioid: comment.comentarioid,
                            comentario: comment.comentario,
                            tipo: comment.tipo,
                            data: comment.data,
                            utilizadorid: comment.utilizadorid,
                            utilizador_nome: comment.comentario_utilizador_nome,
                            fotoUrl: fotoUrl,
                            respostas: []
                        };
                    }
    
                    if (comment.resposta_comentarioid) {
                        ficheiros = await ficheirosController.getAllFilesByAlbum(comment.resposta_utilizadorid, 'UTIL');
                        fotoUrl = ficheiros[0] ? ficheiros[0].url : '';
    
                        if (!commentMap[comment.resposta_comentarioid]) {
                            commentMap[comment.resposta_comentarioid] = {
                                comentarioid: comment.resposta_comentarioid,
                                comentario: comment.resposta_comentario,
                                tipo: 'REPLY',
                                data: comment.resposta_datacriacao,
                                utilizadorid: comment.resposta_utilizadorid,
                                utilizador_nome: comment.resposta_utilizador_nome,
                                fotoUrl: fotoUrl,
                                respostas: []
                            };
                        }
                        commentMap[comment.comentarioid].respostas.push(commentMap[comment.resposta_comentarioid]);
                        responseSet.add(comment.resposta_comentarioid);
                    }
                }
    
                return Object.values(commentMap).filter(comment => !responseSet.has(comment.comentarioid));
            };
    
            const nestedComentarios = await buildNestedComments(comentarios);
    
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: nestedComentarios });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar comentários', details: error.message });
        }
    },
    

    consultarTudo: async (req, res) => {
        try {
            const comentarios = await sequelizeConn.query(
                `SELECT
                    case when ic.tipo = 'POI' then p.pontointeresseid when ic.tipo = 'EVENTO' then e.eventoid else t.threadid end as id,
                    case when ic.tipo = 'POI' then p.titulo when ic.tipo = 'EVENTO' then e.titulo else t.titulo end as titulo,
                    c1.comentarioid AS comentarioid,
                    c1.itemcomentarioid AS itemcomentarioid,
                    c1.utilizadorid AS utilizadorid,
                    c1.comentario AS comentario,
                    c1.datacriacao AS comentario_datacriacao,
                    c1.dataalteracao AS comentario_dataalteracao,
                    CONCAT(u2.pnome, ' ', u2.unome) AS comentario_utilizador_nome,
                    ic.tipo AS tipo,
                    cr.comentariopaiid AS parent_comentarioid,
                    c2.comentarioid AS resposta_comentarioid,
                    c2.comentario AS resposta_comentario,
                    c2.datacriacao AS resposta_datacriacao,
                    c2.dataalteracao AS resposta_dataalteracao,
                    c2.utilizadorid AS resposta_utilizadorid,
                    CONCAT(u3.pnome, ' ', u3.unome) AS resposta_utilizador_nome
                FROM 
                    itemcomentario ic
                LEFT JOIN
                    pontointeresse p ON p.pontointeresseid = ic.registoid AND ic.tipo = 'POI'
                LEFT JOIN
                    thread t ON t.threadid = ic.registoid AND ic.tipo = 'THREAD'
                LEFT JOIN
                    evento e ON e.eventoid = ic.registoid AND ic.tipo = 'EVENTO'
                LEFT JOIN
                    comentario c1 ON ic.itemcomentarioid = c1.itemcomentarioid
                LEFT JOIN
                    utilizador u2 ON c1.utilizadorid = u2.utilizadorid
                LEFT JOIN
                    comentarioresposta cr ON c1.comentarioid = cr.comentariopaiid
                LEFT JOIN
                    comentario c2 ON cr.respostaid = c2.comentarioid
                LEFT JOIN
                    utilizador u3 ON c2.utilizadorid = u3.utilizadorid
                `,
                { type: Sequelize.QueryTypes.SELECT }
            );
    
            const buildNestedComments = (comments) => {
                const commentMap = {};
                const responseSet = new Set();
    
                comments.forEach(comment => {
                    if (!commentMap[comment.comentarioid]) {
                        commentMap[comment.comentarioid] = {
                            comentarioid: comment.comentarioid,
                            comentario: comment.comentario,
                            datacriacao: comment.comentario_datacriacao,
                            tipo: comment.tipo,
                            utilizadorid: comment.utilizadorid,
                            utilizador_nome: comment.utilizador_nome,
                            respostas: []
                        };
                    }
    
                    if (comment.resposta_comentarioid) {
                        if (!commentMap[comment.resposta_comentarioid]) {
                            commentMap[comment.resposta_comentarioid] = {
                                comentarioid: comment.resposta_comentarioid,
                                comentario: comment.resposta_comentario,
                                datacriacao: comment.resposta_datacriacao,
                                tipo: 'REPLY',
                                utilizadorid: comment.resposta_utilizadorid,
                                utilizador_nome: comment.resposta_utilizador_nome,
                                respostas: []
                            };
                        }
                        commentMap[comment.comentarioid].respostas.push(commentMap[comment.resposta_comentarioid]);
                        responseSet.add(comment.resposta_comentarioid);
                    }
                });
    
                return Object.values(commentMap).filter(comment => !responseSet.has(comment.comentarioid));
            };
    
            const poiMap = {};
    
            comentarios.forEach(row => {
                if (!poiMap[row.id]) {
                    poiMap[row.id] = {
                        id: row.id,
                        titulo: row.titulo,
                        tipo: row.tipo,
                        comentarios: []
                    };
                }
    
                if (row.comentarioid) {
                    const comment = {
                        comentarioid: row.comentarioid,
                        comentario: row.comentario,
                        tipo: row.tipo,
                        utilizadorid: row.utilizadorid,
                        utilizador_nome: row.comentario_utilizador_nome,
                        parent_comentarioid: row.parent_comentarioid,
                        resposta_comentarioid: row.resposta_comentarioid,
                        resposta_comentario: row.resposta_comentario,
                        resposta_utilizadorid: row.resposta_utilizadorid,
                        resposta_utilizador_nome: row.resposta_utilizador_nome
                    };
    
                    poiMap[row.id].comentarios.push(comment);
                }
            });
    
            Object.values(poiMap).forEach(poi => {
                poi.comentarios = buildNestedComments(poi.comentarios);
            });
    
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
    },
};

module.exports = comentarioController;