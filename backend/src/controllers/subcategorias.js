const { Sequelize, QueryTypes, Op } = require('sequelize');
const initModels = require('../models/init-models');
const sequelizeConn = require('../bdConexao');
const models = initModels(sequelizeConn);

const controladorSubcategorias = {
    init: async function(){
        try{
            const count = await models.subcategoria.count();

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

                const defaultSubcategorias = [
                    { categoria: 'Gastronomia', descricaoPT: 'Restaurantes', descricaoEN: 'Restaurants', descricaoES: 'Restaurantes' },
                    { categoria: 'Gastronomia', descricaoPT: 'Centros comerciais', descricaoEN: 'Shopping centers', descricaoES: 'Centros comerciales' },
                    { categoria: 'Desporto', descricaoPT: 'Ginásios', descricaoEN: 'Gyms', descricaoES: 'Gimnasios' },
                    { categoria: 'Desporto', descricaoPT: 'Futebol', descricaoEN: 'Football', descricaoES: 'Fútbol' },
                    { categoria: 'Desporto', descricaoPT: 'Padle', descricaoEN: 'Paddle', descricaoES: 'Pádel' },
                    { categoria: 'Desporto', descricaoPT: 'Squash', descricaoEN: 'Squash', descricaoES: 'Squash' },
                    { categoria: 'Desporto', descricaoPT: 'Atletismo', descricaoEN: 'Athletics', descricaoES: 'Atletismo' },
                    { categoria: 'Desporto', descricaoPT: 'Cliclismo', descricaoEN: 'Cycling', descricaoES: 'Ciclismo' },
                    { categoria: 'Desporto', descricaoPT: 'Karting', descricaoEN: 'Karting', descricaoES: 'Karting' },
                    { categoria: 'Saúde', descricaoPT: 'Clínicas médicas e hospitais', descricaoEN: 'Medical clinics and hospitals', descricaoES: 'Clínicas médicas y hospitales' },
                    { categoria: 'Saúde', descricaoPT: 'Clínicas dentárias', descricaoEN: 'Dental clinics', descricaoES: 'Clínicas dentales' },
                    { categoria: 'Saúde', descricaoPT: 'Clínicas veterinárias', descricaoEN: 'Veterinary clinics', descricaoES: 'Clínicas veterinarias' },
                    { categoria: 'Alojamento', descricaoPT: 'Quartos para arrendar', descricaoEN: 'Rooms for rent', descricaoES: 'Cuartos para rentar' },
                    { categoria: 'Alojamento', descricaoPT: 'Casas para alugar', descricaoEN: 'Houses for rent', descricaoES: 'Casas en alquiler' },
                    { categoria: 'Alojamento', descricaoPT: 'Casas de férias', descricaoEN: 'Holiday homes', descricaoES: 'Casas de vacaciones' },
                    { categoria: 'Alojamento', descricaoPT: 'Escapadinhas', descricaoEN: 'Short breaks', descricaoES: 'Escapadas' },
                    { categoria: 'Lazer', descricaoPT: 'Cinema', descricaoEN: 'Cinema', descricaoES: 'Cine' },
                    { categoria: 'Lazer', descricaoPT: 'Parques', descricaoEN: 'Parks', descricaoES: 'Parques' },
                    { categoria: 'Formação', descricaoPT: 'Centros de formação', descricaoEN: 'Training centers', descricaoES: 'Centros de formación' },
                    { categoria: 'Formação', descricaoPT: 'Escolas', descricaoEN: 'Schools', descricaoES: 'Escuelas' },
                    { categoria: 'Formação', descricaoPT: 'Infantários', descricaoEN: 'Nurseries', descricaoES: 'Guarderías' },
                    { categoria: 'Transporte', descricaoPT: 'Boleias', descricaoEN: 'Carpooling', descricaoES: 'Compartir Coche' },
                    { categoria: 'Transporte', descricaoPT: 'Transportes públicos', descricaoEN: 'Public transport', descricaoES: 'Transporte público' }
                ];

                for (const subcategoria of defaultSubcategorias) {
                    const chaveSearch = await models.chave.findOne({
                        where: { 
                            [Op.and]: [
                                {entidade: 'CATEGORIA'},
                                Sequelize.literal(`chaveid IN (SELECT chaveid FROM traducao WHERE valor = '${subcategoria.categoria}' AND idiomaID = 1)`)
                            ]
                        }
                    });

                    if (chaveSearch) {
                        const subcatCreated = await models.subcategoria.create({ 
                            categoriaid: chaveSearch.registoid
                        });
                        
                        const chave = await models.chave.create({ 
                            registoid: subcatCreated.subcategoriaid, 
                            entidade: 'SUBCAT' 
                        });
                        
                        const traducoes = [
                            { chaveid: chave.chaveid, idiomaid: idiomas.pt, valor: subcategoria.descricaoPT },
                            { chaveid: chave.chaveid, idiomaid: idiomas.en, valor: subcategoria.descricaoEN },
                            { chaveid: chave.chaveid, idiomaid: idiomas.es, valor: subcategoria.descricaoES }
                        ];
                        await Promise.all(traducoes.map(traducao => models.traducao.create(traducao)));
                    }
                }
            }
        } catch (error) {
            console.error('Erro ao inicializar as subcategorias :', error);
        }
    },

    adicionar: async (req, res) => {
        const { categoriaID, descricaoPT, descricaoEN, descricaoES } = req.body;
    
        try {
            const idiomaPT = await models.idioma.findOne({ where: { icone: 'pt' } });
            const idiomaEN = await models.idioma.findOne({ where: { icone: 'en' } });
            const idiomaES = await models.idioma.findOne({ where: { icone: 'es' } });
    
            const idiomas = {
                pt: idiomaPT.idiomaid,
                en: idiomaEN.idiomaid,
                es: idiomaES.idiomaid,
            };
    
            const subcategoria = await models.subcategoria.create({
                categoriaid: categoriaID
            });
    
            const chave = await models.chave.create({
                registoid: subcategoria.subcategoriaid,
                entidade: 'SUBCAT'
            });
    
            const traducoes = [
                { chaveid: chave.chaveid, idiomaid: idiomas.pt, valor: descricaoPT },
                { chaveid: chave.chaveid, idiomaid: idiomas.en, valor: descricaoEN },
                { chaveid: chave.chaveid, idiomaid: idiomas.es, valor: descricaoES }
            ];
            await Promise.all(traducoes.map(traducao => models.traducao.create(traducao)));
    
            res.status(201).json({ message: 'Subcategoria adicionada com sucesso' });
        } catch (error) {
            console.error('Erro ao adicionar subcategoria:', error);
            res.status(500).json({ error: 'Erro ao adicionar subcategoria', details: error.message });
        }
    },

    atualizar: async (req, res) => {
        const { idSubCat } = req.params;
        const { categoria, descricaoPT, descricaoEN, descricaoES, inactivo } = req.body;
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
            
            const subcategoria = await models.subcategoria.findByPk(idSubCat);
            if (!subcategoria) {
                return res.status(404).json({ error: 'Subcategoria não encontrada' });
            }

            await models.subcategoria.update({
                categoriaid: categoria,
                inactivo: inactivo
            }, {
                where: {
                    subcategoriaid: idSubCat
                }
            });

            const chave = await models.chave.findOne({
                where: {
                    registoid: idSubCat,
                    entidade: 'SUBCAT'
                }
            });
            if (!chave) {
                return res.status(404).json({ error: 'Chave não encontrada para a subcategoria' });
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

            res.status(200).json({ message: 'Subcategoria atualizada com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar a subcategoria', details: error.message });
        }
    },
    
    remover: async (req, res) => {
        const { idSubCat } = req.params;
        
        try{
            const subcategoria = await models.subcategoria.findByPk(idSubCat);
            if (!subcategoria) {
                return res.status(404).json({ error: 'Subcategoria não encontrada' });
            }

            const chave = await models.chave.findOne({
                where: {
                    registoid: idSubCat,
                    entidade: 'SUBCAT'
                }
            });
            if (!chave) {
                return res.status(404).json({ error: 'Chave não encontrada para a subcategoria' });
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

            await models.subcategoria.destroy({
                where: {
                    subcategoriaid: idSubCat
                }
            });

            res.status(200).json({ message: 'Subcategoria removida com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao remover a subcategoria', details: error.message });
        }
    },

    consultarPorCategoria: async (req, res) => {
        const { idCat } = req.params;

        try {
            const subcategorias = await sequelizeConn.query(
                `SELECT 
                    sc.*, 
                    (SELECT valor from traducao WHERE ch.chaveid = traducao.chaveid AND idiomaID = 1) as ValorPT, 
                    (SELECT valor from traducao WHERE ch.chaveid = traducao.chaveid AND idiomaID = 2) as ValorEN, 
                    (SELECT valor from traducao WHERE ch.chaveid = traducao.chaveid AND idiomaID = 3) as ValorES 
                FROM 
                    subcategoria sc 
                INNER JOIN 
                    chave ch ON sc.subcategoriaid = ch.registoid AND ch.entidade = 'SUBCAT' 
                WHERE
                    sc.categoriaID = ${idCat}
                `,
                {
                    type: QueryTypes.SELECT
                }
            );
            
            res.status(200).json(subcategorias);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar as subcategorias', details: error.message });
        }
    },

    consultarCategoriaPorSubcategoria: async (req, res) => {
        const { idSubCat } = req.params;
    
        try {
            const categoria = await sequelizeConn.query(
                `SELECT 
                    c.*, 
                    (SELECT valor FROM traducao WHERE ch.chaveid = traducao.chaveid AND idiomaID = 1) as ValorPT, 
                    (SELECT valor FROM traducao WHERE ch.chaveid = traducao.chaveid AND idiomaID = 2) as ValorEN, 
                    (SELECT valor FROM traducao WHERE ch.chaveid = traducao.chaveid AND idiomaID = 3) as ValorES
                FROM 
                    subcategoria s 
                INNER JOIN 
                    categoria c ON s.categoriaid = c.categoriaid 
                INNER JOIN 
                    chave ch ON s.subcategoriaid = ch.registoid AND ch.entidade = 'SUBCAT'
                INNER JOIN 
                    chave ch ON c.categoriaid = ch.registoid AND ch.entidade = 'CATEGORIA'
                WHERE
                    s.subcategoriaid = ${idSubCat}`,
                {
                    type: QueryTypes.SELECT
                }
            );
    
            if (categoria.length === 0) {
                return res.status(404).json({ error: 'Subcategoria não encontrada' });
            }
    
            res.status(200).json(categoria[0]);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar a categoria pela subcategoria', details: error.message });
        }
    },

    consultarPorID: async (req, res) => {
        const { idSubcat } = req.params;
        try {
            const subcategoria = await sequelizeConn.query(
                `SELECT 
                    sc.*, 
                    (SELECT valor FROM traducao WHERE ch.chaveid = traducao.chaveid AND idiomaid = 1) as ValorPT, 
                    (SELECT valor FROM traducao WHERE ch.chaveid = traducao.chaveid AND idiomaid = 2) as ValorEN, 
                    (SELECT valor FROM traducao WHERE ch.chaveid = traducao.chaveid AND idiomaid = 3) as ValorES 
                FROM 
                    subcategoria sc 
                INNER JOIN 
                    chave ch ON sc.subcategoriaid = ch.registoid AND ch.entidade = 'SUBCAT'
                WHERE sc.subcategoriaid = :idSubcat`,
                {
                    replacements: { idSubcat },
                    type: QueryTypes.SELECT
                }
            );

            if (subcategoria.length === 0) {
                return res.status(404).json({ error: 'Subcategoria não encontrada' });
            }

            res.status(200).json(subcategoria[0]);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar a subcategoria', details: error.message });
        }
    },

    adicionarSubcategoriaFav: async (req, res) => {
        const { subcategoriaid, utilizadorid } = req.body;

        try {
            await models.subcategoria_fav_util.create({
                subcategoriaid: subcategoriaid,
                utilizadorid: utilizadorid
            });

            res.status(201).json({ message: 'Subcategoria favorita adicionada com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao adicionar subcategoria favorita', details: error.message });
        }
    },

    atualizarSubcategoriaFav: async (req, res) => {
        const { idSubCatFav } = req.params;
        const { subcategoriaid, utilizadorid } = req.body;

        try {
            await models.subcategoria_fav_util.update({
                subcategoriaid: subcategoriaid,
                utilizadorid: utilizadorid
            }, {
                where: {
                    subcategoria_fav_utilid: idSubCatFav
                }
            });

            res.status(200).json({ message: 'Subcategoria favorita atualizada com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar subcategoria favorita', details: error.message });
        }
    },

    removerSubcategoriaFav: async (req, res) => {
        const { idSubCatFav } = req.params;

        try {
            await models.subcategoria_fav_util.destroy({
                where: {
                    subcategoria_fav_utilid: idSubCatFav
                }
            });

            res.status(200).json({ message: 'Subcategoria favorita removida com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao remover subcategoria favorita', details: error.message });
        }
    },

    consultarTudo: async (req, res) => {
        try {
            const subcategorias = await sequelizeConn.query(
                `SELECT 
                    s.*, 
                    (SELECT valor from traducao WHERE ch.chaveid = traducao.chaveid AND idiomaID = 1) as ValorPT, 
                    (SELECT valor from traducao WHERE ch.chaveid = traducao.chaveid AND idiomaID = 2) as ValorEN, 
                    (SELECT valor from traducao WHERE ch.chaveid = traducao.chaveid AND idiomaID = 3) as ValorES,
                    (SELECT valor from traducao WHERE ch2.chaveid = traducao.chaveid AND idiomaID = 1) as ValorPTCat, 
                    (SELECT valor from traducao WHERE ch2.chaveid = traducao.chaveid AND idiomaID = 2) as ValorENCat, 
                    (SELECT valor from traducao WHERE ch2.chaveid = traducao.chaveid AND idiomaID = 3) as ValorESCat
                FROM 
                    subcategoria s 
                INNER JOIN 
                    chave ch ON s.subcategoriaid = ch.registoid AND ch.entidade = 'SUBCAT'
                INNER JOIN 
                    chave ch2 ON s.categoriaid = ch2.registoid AND ch2.entidade = 'CATEGORIA' `,
                {
                    type: QueryTypes.SELECT
                }
            );
            
            res.status(200).json(subcategorias);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar as subcategorias', details: error.message });
        }
    },

    consultarTudoMobile: async (req, res) => {
        try {
            const subcategorias = await sequelizeConn.query(
                `SELECT 
                    sc.subcategoriaid AS "subcategoriaId",
                    sc.categoriaid AS "categoriaId",
                    t.valor AS "descricao",
                    t.idiomaid AS "idiomaId"
                FROM 
                    subcategoria sc 
                    INNER JOIN 
                        chave ch ON sc.subcategoriaid = ch.registoid AND ch.entidade = 'SUBCAT'
                    INNER JOIN 
                        traducao t ON t.chaveid = ch.chaveid
                    ORDER BY 
                        sc.categoriaid ASC, t.idiomaid ASC `,
                {
                    type: QueryTypes.SELECT
                }
            );
            
            res.status(200).json({data: subcategorias});
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar as subcategorias', details: error.message });
        }
    },

    consultarTudoComFiltroPT: async (req, res) => {
        const { estado, categoria, descricao } = req.query;
        try {
            let whereClause = '';
    
            if (estado !== undefined) {
                whereClause += ` AND s.inactivo = ${estado}`;
            }

            if (categoria > 0){
                whereClause += ` AND s.categoriaid = ${categoria}`;
            }
        
            const query = `
                SELECT 
                    s.*, 
                    t.valor AS ValorPT,
                    t2.valor AS ValorPTCat
                FROM 
                    subcategoria s 
                INNER JOIN 
                    chave ch ON s.subcategoriaid = ch.registoid AND ch.entidade = 'SUBCAT' 
                INNER JOIN 
                    traducao t on ch.chaveid = t.chaveid AND t.idiomaID = 1
                INNER JOIN 
                    chave ch2 ON s.categoriaid = ch2.registoid AND ch2.entidade = 'CATEGORIA'
                INNER JOIN 
                    traducao t2 on ch2.chaveid = t2.chaveid AND t2.idiomaID = 1
                WHERE 
                    t.valor LIKE '%${descricao}%'
                ${whereClause}
            `;
    
            const categorias = await sequelizeConn.query(query, {
                type: QueryTypes.SELECT,
            });
    
            res.status(200).json(categorias);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar as categorias', details: error.message });
        }
    }
};

module.exports = controladorSubcategorias;
