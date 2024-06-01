const { Sequelize, QueryTypes } = require('sequelize');
const initModels = require('../models/init-models');
const sequelizeConn = require('../bdConexao');
const models = initModels(sequelizeConn);

const controladorCategorias = {
    init: async function(){
        try{
            const count = await models.categoria.count();

            if (count < 1){
                const idiomaPT = await models.idioma.findOne({
                    where: { 
                        icone: 'pt'
                    }
                });
                const idiomaEN = await models.idioma.findOne({
                    where: { 
                        icone: 'en'
                    }
                });
                const idiomaES = await models.idioma.findOne({
                    where: { 
                        icone: 'es'
                    }
                });

                const idiomas = {
                    pt: idiomaPT.idiomaid,
                    en: idiomaEN.idiomaid,
                    es: idiomaES.idiomaid,
                };

                const defaultCategorias = [
                    { descricaoPT: 'Gastronomia', descricaoEN: 'Gastronomy', descricaoES: 'Gastronomía', icone: 'garfo', cor: 'FF4500' },
                    { descricaoPT: 'Desporto', descricaoEN: 'Sport', descricaoES: 'Deporte', icone: 'futebol', cor: '1E90FF' },
                    { descricaoPT: 'Lazer', descricaoEN: 'Leisure', descricaoES: 'Ocio', icone: 'arvore', cor: '228B22' },
                    { descricaoPT: 'Alojamento', descricaoEN: 'Accommodation', descricaoES: 'Alojamiento', icone: 'casa', cor: '8A2BE2' },
                    { descricaoPT: 'Saúde', descricaoEN: 'Health', descricaoES: 'Salud', icone: 'cruz', cor: 'FF6347' },
                    { descricaoPT: 'Formação', descricaoEN: 'Education', descricaoES: 'Formación', icone: 'escola', cor: 'FFA500' },
                    { descricaoPT: 'Transporte', descricaoEN: 'Transport', descricaoES: 'Transporte', icone: 'infra', cor: '2F4F4F' }
                ];

                for (const categoria of defaultCategorias) {
                    const catCreated = await models.categoria.create({ 
                        desistema: true,
                        cor: categoria.cor, 
                        icone: categoria.icone 
                    });
                    
                    const chave = await models.chave.create({ 
                        registoid: catCreated.categoriaid, 
                        entidade: 'CATEGORIA' 
                    });
                    
                    const traducoes = [
                        { chaveid: chave.chaveid, idiomaid: idiomas.pt, valor: categoria.descricaoPT },
                        { chaveid: chave.chaveid, idiomaid: idiomas.en, valor: categoria.descricaoEN },
                        { chaveid: chave.chaveid, idiomaid: idiomas.es, valor: categoria.descricaoES }
                    ];
                    await Promise.all(traducoes.map(traducao => models.traducao.create(traducao)));
                }
            }
        } catch (error) {
            console.error('Erro ao inicializar as categorias :', error);
        }
    },

    adicionar: async (req, res) => {
        const { descricaoPT, descricaoEN, descricaoES } = req.body;

        try {
            const idiomaPT = await models.idioma.findOne({
                where: { 
                    icone: 'pt'
                }
            });
            const idiomaEN = await models.idioma.findOne({
                where: { 
                    icone: 'en'
                }
            });
            const idiomaES = await models.idioma.findOne({
                where: { 
                    icone: 'es'
                }
            });

            const idiomas = {
                pt: idiomaPT.idiomaid,
                en: idiomaEN.idiomaid,
                es: idiomaES.idiomaid,
            };

            const categoria = await models.categoria.create({
                cor: '',
                icone: ''
            });

            const chave = await models.chave.create({
                registoid: categoria.categoriaid,
                entidade: 'CATEGORIA'
            })

            const traducoes = [
                { chaveid: chave.chaveid, idiomaid: idiomas.pt, valor: descricaoPT },
                { chaveid: chave.chaveid, idiomaid: idiomas.en, valor: descricaoEN },
                { chaveid: chave.chaveid, idiomaid: idiomas.es, valor: descricaoES }
            ];
            await Promise.all(traducoes.map(traducao => models.traducao.create(traducao)));

            res.status(201).json({ message: 'Categoria adicionada com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao adicionar categoria', details: error.message });
        }
    },

    atualizar: async (req, res) => {
        const { idCat } = req.params;
        const { descricaoPT, descricaoEN, descricaoES, inativo } = req.body;

        try {
            const idiomaPT = await models.idioma.findOne({
                where: { 
                    icone: 'pt'
                }
            });
            const idiomaEN = await models.idioma.findOne({
                where: { 
                    icone: 'en'
                }
            });
            const idiomaES = await models.idioma.findOne({
                where: { 
                    icone: 'es'
                }
            });

            const idiomas = {
                pt: idiomaPT.idiomaid,
                en: idiomaEN.idiomaid,
                es: idiomaES.idiomaid,
            };

            const categoria = await models.categoria.findByPk(idCat);
            if (!categoria) {
                return res.status(404).json({ error: 'Categoria não encontrada' });
            }

            await models.categoria.update({
                inativo: inativo
            }, {
                where: {
                    categoriaid: idCat
                }
            });

            const chave = await models.chave.findOne({
                where: {
                    registoid: idCat,
                    entidade: 'CATEGORIA'
                }
            });
            if (!chave) {
                return res.status(404).json({ error: 'Chave não encontrada para a categoria' });
            }

            const traducoes = [
                { chaveid: chave.chaveid, idiomaid: idiomas.pt, valor: descricaoPT },
                { chaveid: chave.chaveid, idiomaid: idiomas.en, valor: descricaoEN },
                { chaveid: chave.chaveid, idiomaid: idiomas.es, valor: descricaoES }
            ];
            await Promise.all(traducoes.map(async traducao => {
                await models.traducao.update(
                    { 
                        valor: traducao.valor 
                    },{
                        where: {
                            chaveid: traducao.chaveid,
                            idiomaid: traducao.idiomaid
                        }
                    }
                );
            }));

            res.status(200).json({ message: 'Categoria atualizada com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar a categoria', details: error.message });
        }
    },
    
    remover: async (req, res) => {
        const { idCat } = req.params;
        
        try{
            const categoria = await models.categoria.findByPk(idCat);
            if (!categoria) {
                return res.status(404).json({ error: 'Categoria não encontrada' });
            }

            const chave = await models.chave.findOne({
                where: {
                    registoid: idCat,
                    entidade: 'CATEGORIA'
                }
            });
            if (!chave) {
                return res.status(404).json({ error: 'Chave não encontrada para a categoria' });
            }

            await models.traducao.destroy({
                where: {
                    chaveid: chave.chaveid
                }
            });

            await models.chave.destroy({
                where: {
                    chaveid: chave.chaveid
                }
            });

            await models.categoria.destroy({
                where: {
                    categoriaid: categoriaid
                }
            });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao remover a categoria', details: error.message });
        }
    },

    consultarTudo: async (req, res) => {
        try {
            const categorias = await sequelizeConn.query(
                `SELECT 
                    c.*, 
                    (SELECT valor from traducao WHERE ch.chaveid = traducao.chaveid AND idiomaID = 1) as ValorPT, 
                    (SELECT valor from traducao WHERE ch.chaveid = traducao.chaveid AND idiomaID = 2) as ValorEN, 
                    (SELECT valor from traducao WHERE ch.chaveid = traducao.chaveid AND idiomaID = 3) as ValorES 
                FROM 
                    categoria c 
                INNER JOIN 
                    chave ch ON c.categoriaid = ch.registoid AND ch.entidade = 'CATEGORIA' `,
                {
                    type: QueryTypes.SELECT
                }
            );
            
            res.status(200).json(categorias);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar as categorias', details: error.message });
        }
    },

    consultarTudoComFiltroPT: async (req, res) => {
        const { estado, descricao } = req.query;
        try {
            let whereClause = '';
            const replacements = {};
    
            if (estado !== undefined) {
                whereClause += ` AND c.inactivo = ${estado}`;
            }
        
            const query = `
                SELECT 
                    c.*, 
                    t.valor AS ValorPT
                FROM 
                    categoria c 
                INNER JOIN 
                    chave ch ON c.categoriaid = ch.registoid AND ch.entidade = 'CATEGORIA' 
                INNER JOIN 
                    traducao t on ch.chaveid = t.chaveid AND idiomaID = 1
                WHERE 
                    t.valor LIKE '%${descricao}%'
                ${whereClause}
            `;

            console.log(query);
    
            const categorias = await sequelizeConn.query(query, {
                type: QueryTypes.SELECT,
                replacements,
            });
    
            res.status(200).json(categorias);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar as categorias', details: error.message });
        }
    }
};

module.exports = controladorCategorias;
