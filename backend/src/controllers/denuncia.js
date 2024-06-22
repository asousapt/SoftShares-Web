const { Sequelize, Op } = require('sequelize');
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
        console.log('iddenunca, idcomentario', idDenuncia, comentarioid);

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
        const { descricao } = req.query;
        try {
            const denuncias = await models.denuncia.findAll({
                where: {
                    texto: {
                        [Op.like]: `%${descricao}%`
                    },
                    utilizadormodera: {
                        [Op.is]: null
                    },
                    datatratamento: {
                        [Op.is]: null
                    }
                },
                include: [
                    {
                        model: models.utilizador,
                        as: 'utilizadorcriou_utilizador',
                        attributes: ['pnome', 'unome']
                    }
                ]
            });
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: denuncias });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar denúncias', details: error.message });
        }
    }
};

module.exports = denunciaController;
