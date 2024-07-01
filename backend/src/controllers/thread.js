const { Sequelize, QueryTypes } = require('sequelize');
const initModels = require('../models/init-models');
const sequelizeConn = require('../bdConexao');
const models = initModels(sequelizeConn);
const ficheirosController = require('./ficheiros');

const controladorThread = {
    adicionar: async (req, res) => {
        const { subcategoriaid, utilizadorid, titulo, mensagem, idiomaid, imagens } = req.body;

        try {
            const thread = await models.thread.create({
                subcategoriaid: subcategoriaid,
                utilizadorid: utilizadorid,
                titulo: titulo,
                mensagem: mensagem,
                idiomaid: idiomaid
            });

            await models.objecto.create({
                registoid: thread.threadid,
                entidade: 'THREAD'
            });
            
            ficheirosController.adicionar(thread.threadid, 'THREAD', imagens, utilizadorid);

            res.status(201).json({ message: 'Thread adicionada com sucesso', data: thread });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao adicionar thread', details: error.message });
        }
    },

    atualizar: async (req, res) => {
        const { id } = req.params;
        const { subcategoriaid, titulo, mensagem, inactivo, imagens, utilizadorid } = req.body;

        try {
            const thread = await models.thread.findByPk(id);
            if (!thread) {
                return res.status(404).json({ error: 'Thread não encontrada' });
            }

            await models.thread.update({
                titulo: titulo,
                mensagem: mensagem,
                subcategoriaid: subcategoriaid,
                inactivo: inactivo
            }, {
                where: {
                    threadid: id
                }
            });

            await ficheirosController.removerTodosFicheirosAlbum(id, 'THREAD');
            ficheirosController.adicionar(id, 'THREAD', imagens, utilizadorid);

            res.status(200).json({ message: 'Thread atualizada com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar thread', details: error.message });
        }
    },

    remover: async (req, res) => {
        const { id } = req.params;

        try {
            const thread = await models.thread.findByPk(id);
            if (!thread) {
                return res.status(404).json({ error: 'Thread não encontrada' });
            }

            await models.objecto.destroy({
                where: {
                    registoid: id,
                    entidade: 'THREAD'
                }
            });

            await models.thread.destroy({
                where: {
                    threadid: id
                }
            });

            res.status(200).json({ message: 'Thread removida com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao remover thread', details: error.message });
        }
    },

    consultarPorSubcategoria: async (req, res) => {
        const { subcategoriaid } = req.params;

        try {
            const threads = await models.thread.findAll({
                where: {
                    subcategoriaid: subcategoriaid
                }
            });

            res.status(200).json({ message: 'Consulta realizada com sucesso', data: threads });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar threads por subcategoria', details: error.message });
        }
    },

    consultarPorSubcategoriaCount: async (req, res) => {
        try {
            const threads = await sequelizeConn.query(
                `SELECT 
                    COUNT(t.subcategoriaid) AS total, 
                    (SELECT valor FROM traducao WHERE ch.chaveid = traducao.chaveid AND idiomaid = 1) AS ValorPT
                FROM 
                    thread t
                INNER JOIN 
                    chave ch ON t.subcategoriaid = ch.registoid AND ch.entidade = 'SUBCAT'
                INNER JOIN
                    subcategoria s ON s.subcategoriaid = t.subcategoriaid
                GROUP BY
                    ch.chaveid
                `,
                {
                    type: QueryTypes.SELECT
                }
            );

            res.status(200).json({ message: 'Consulta realizada com sucesso', data: threads });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar threads por subcategoria', details: error.message });
        }
    },

    consultarTodos: async (req, res) => {
        try {
            const threads = await sequelizeConn.query(
                `SELECT 
                    t.*,
                    s.categoriaID,
                    (SELECT valor FROM traducao WHERE ch.chaveid = traducao.chaveid AND idiomaid = 1) AS ValorPT, 
                    (SELECT valor FROM traducao WHERE ch.chaveid = traducao.chaveid AND idiomaid = 2) AS ValorEN, 
                    (SELECT valor FROM traducao WHERE ch.chaveid = traducao.chaveid AND idiomaid = 3) AS ValorES,
                    u.pnome, 
                    u.unome
                FROM 
                    thread t
                INNER JOIN 
                    chave ch ON t.subcategoriaid = ch.registoid AND ch.entidade = 'SUBCAT'
                INNER JOIN
                    utilizador u ON t.utilizadorid = u.utilizadorid
                INNER JOIN
                    subcategoria s ON t.subcategoriaid = s.subcategoriaid
                `,
                {
                    type: QueryTypes.SELECT
                }
            );

            const threadsWithFiles = await Promise.all(threads.map(async (thread) => {
                const ficheiros = await ficheirosController.getAllFilesByAlbum(thread.threadid, 'THREAD');
                return {
                    ...thread,
                    imagens: ficheiros || []
                };
            }));

            res.status(200).json({ message: 'Consulta realizada com sucesso', data: threadsWithFiles });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar threads', details: error.message });
        }
    },

    consultarPorID: async (req, res) => {
        const { id } = req.params;
        try {
            const threads = await sequelizeConn.query(
                `SELECT 
                    t.*, 
                    (SELECT valor FROM traducao WHERE ch.chaveid = traducao.chaveid AND idiomaid = 1) AS ValorPT, 
                    (SELECT valor FROM traducao WHERE ch.chaveid = traducao.chaveid AND idiomaid = 2) AS ValorEN, 
                    (SELECT valor FROM traducao WHERE ch.chaveid = traducao.chaveid AND idiomaid = 3) AS ValorES,
                    s.categoriaid
                FROM 
                    thread t
                INNER JOIN 
                    chave ch ON t.subcategoriaid = ch.registoid AND ch.entidade = 'SUBCAT'
                INNER JOIN
                    subcategoria s ON s.subcategoriaid = t.subcategoriaid
                INNER JOIN
                    utilizador u ON t.utilizadorid = u.utilizadorid
                WHERE
                    t.threadid = ${id}
                `,
                {
                    type: QueryTypes.SELECT
                }
            );

            const ficheiros = await ficheirosController.getAllFilesByAlbum(id, 'THREAD');
            threads[0].imagens = ficheiros;

            res.status(200).json({ message: 'Consulta realizada com sucesso', data: threads });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar threads', details: error.message });
        }
    },

    consultarTodosComFiltro: async (req, res) => {
        const { categoria, descricao } = req.query;
        try {
            let whereClause = '';
            if (categoria > 0){
                whereClause += ` AND t.subcategoriaid IN (SELECT subcategoriaid FROM subcategoria WHERE categoriaid = ${categoria}) `;
            }

            const threads = await sequelizeConn.query(
                `SELECT 
                    t.*, 
                    tr.valor as valorpt,
                    u.pnome, 
                    u.unome
                FROM 
                    thread t
                INNER JOIN 
                    chave ch ON t.subcategoriaid = ch.registoid AND ch.entidade = 'SUBCAT'
                LEFT JOIN 
                    traducao tr ON ch.chaveid = tr.chaveid AND tr.idiomaid = 1
                INNER JOIN
                    utilizador u ON t.utilizadorid = u.utilizadorid
                WHERE
                    t.titulo LIKE '%${descricao}%'
                ${whereClause}
                ORDER BY 
                    t.threadid `,
                { type: QueryTypes.SELECT }
            );
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: threads });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar utilizadores', details: error.message });
        }
    }, 
};

module.exports = controladorThread;
