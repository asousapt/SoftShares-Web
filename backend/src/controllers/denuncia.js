const { Sequelize, Op, QueryTypes } = require('sequelize');
const initModels = require('../models/init-models');
const sequelizeConn = require('../bdConexao');
const models = initModels(sequelizeConn);

const denunciaController = {
    adicionar: async (req, res) => {
        const { comentarioid, utilizadorcriou, texto } = req.body;

        try {
            await models.denuncia.create({
                comentarioid: comentarioid,
                utilizadorcriou: utilizadorcriou,
                texto: texto
            });

            res.status(201).json({ message: 'Denúncia adicionada com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao adicionar denúncia', details: error.message });
        }
    },

    atualizar: async (req, res) => {
        const { idDenuncia } = req.params;
        const { texto, utilizadormodera } = req.body;

        try {
            await models.denuncia.update({
                texto: texto,
                utilizadormodera: utilizadormodera,
                datatratamento: Sequelize.literal('CURRENT_TIMESTAMP')
            }, {
                where: {
                    denunciaid: idDenuncia
                }
            });

            res.status(200).json({ message: 'Denúncia atualizada com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar denúncia', details: error.message });
        }
    },

    aprovar: async (req, res) => {
        const { idDenuncia } = req.params;
        const { texto, utilizadormodera } = req.body;

        try {
            await models.denuncia.update({
                texto: texto,
                utilizadormodera: utilizadormodera,
                datatratamento: Sequelize.literal('CURRENT_TIMESTAMP')
            }, {
                where: {
                    denunciaid: idDenuncia
                }
            });

            res.status(200).json({ message: 'Denúncia atualizada com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar denúncia', details: error.message });
        }
    },

    remover: async (req, res) => {
        const { idDenuncia } = req.params;

        try {
            await models.denuncia.destroy({
                where: {
                    denunciaid: idDenuncia
                }
            });

            res.status(200).json({ message: 'Denúncia removida com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao remover denúncia', details: error.message });
        }
    },

    rejeitar: async (req, res) => {
        const { idDenuncia } = req.params;
        const { utilizadormodera, comentarioid } = req.body;

        try {
            await models.denuncia.update({
                utilizadormodera: utilizadormodera,
                datatratamento: Sequelize.literal('CURRENT_TIMESTAMP')
            }, {
                where: {
                    denunciaid: idDenuncia
                }
            });

            await models.comentario.update({
                removido: true
            }, {
                where: {
                    comentarioid: comentarioid
                }
            });

            res.status(200).json({ message: 'Comentario denunciado atualizado para removido com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar estado de comentario denunciado', details: error.message });
        }
    },

    consultarTudo: async (req, res) => {
        try {
            const denuncias = await models.denuncia.findAll();
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: denuncias });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar denúncias', details: error.message });
        }
    },

    consultarCountDenuncias: async (req, res) => {
        const { utilizadorid } = req.params;

        try {
            const query = await sequelizeConn.query(
                `SELECT 
                    p.poloid,
                    p.descricao,
                    COUNT(d.denunciaid) AS count
                FROM 
                    denuncia d
                JOIN 
                    utilizador u ON d.utilizadorcriou = u.utilizadorid
                JOIN 
                    polo p ON u.poloid = p.poloid
                WHERE 
                    d.utilizadorcriou = u.utilizadorid
                GROUP BY 
                    p.poloid;
            `,
                { type: QueryTypes.SELECT },
            );

            res.status(200).json({ message: 'Consulta realizada com sucesso', data: query });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar denúncias', details: error.message });
        }
    },

    consultarComentario: async (req, res) => {
        const { idComentario } = req.params;

        try {
            const denuncias = await models.denuncia.findAll({
                where: {
                    comentarioid: idComentario
                }
            });
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: denuncias });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar denúncias por comentário', details: error.message });
        }
    },

    consultarTudoComFiltro: async (req, res) => {
        const { descricao, poloid } = req.query;

        try {
            let whereClause = '';

            whereClause += ` AND d.utilizadormodera IS NULL`;
            whereClause += ` AND d.datatratamento IS NULL`;

            if (poloid) {
                whereClause += ` AND (p.poloid= ${poloid} OR t.poloid = ${poloid}) `;
            }

            const denuncias = await sequelizeConn.query(
                `SELECT 
                        d.*, 
                        CONCAT(u.pnome, ' ' , u.unome) AS utilizadorcriou,
                        ic.*,
                        CASE WHEN p.poloid IS NULL THEN t.poloid ELSE p.poloid END AS poloid
                    FROM 
                        denuncia d
                    LEFT JOIN 
                        utilizador u ON d.utilizadorcriou = u.utilizadorid
                    LEFT JOIN
                        comentario c ON d.comentarioid = c.comentarioid
                    LEFT JOIN
                        itemcomentario ic ON c.itemcomentarioid = ic.itemcomentarioid
                    LEFT JOIN
                        pontointeresse p ON ic.registoid = p.pontointeresseid AND ic.tipo = 'POI'
                    LEFT JOIN
                        thread t ON ic.registoid = t.threadid AND ic.tipo = 'THREAD'
                    WHERE
                        d.texto LIKE '%${descricao}%'
                    ${whereClause}
                        `,
                { type: QueryTypes.SELECT }
            );

            res.status(200).json({ message: 'Consulta realizada com sucesso', data: denuncias });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar denúncias', details: error.message });
        }
    }
};

module.exports = denunciaController;
