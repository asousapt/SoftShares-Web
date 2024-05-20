const { Sequelize, Op } = require('sequelize');
const initModels = require('../models/init-models');
const sequelizeConn = require('../bdConexao');
const models = initModels(sequelizeConn);

const controladorCategorias = {
    init: async function(){
        try{
            const count = await models.categoria.count();

            if (count < 1){
                const defaultCategorias = [
                    { descricaoPT: 'Gastronomia', descricaoEN: 'Gastronomy', descricaoES: 'Gastronomía', icone: 'garfo', cor: 'FF4500' },
                    { descricaoPT: 'Desporto', descricaoEN: 'Sport', descricaoES: 'Deporte', icone: 'futebol', cor: '1E90FF' },
                    { descricaoPT: 'Atividade Ar Livre', descricaoEN: 'Outdoor Activity', descricaoES: 'Actividad al aire libre', icone: 'arvore', cor: '228B22' },
                    { descricaoPT: 'Alojamento', descricaoEN: 'Accommodation', descricaoES: 'Alojamiento', icone: 'casa', cor: '8A2BE2' },
                    { descricaoPT: 'Saúde', descricaoEN: 'Health', descricaoES: 'Salud', icone: 'cruz', cor: 'FF6347' },
                    { descricaoPT: 'Educação', descricaoEN: 'Education', descricaoES: 'Educación', icone: 'escola', cor: 'FFA500' },
                    { descricaoPT: 'Infraestruturas', descricaoEN: 'Infrastructures', descricaoES: 'Infraestructuras', icone: 'infra', cor: '2F4F4F' }
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
                        { chaveid: chave.chaveid, idiomaid: 1, valor: categoria.descricaoPT },
                        { chaveid: chave.chaveid, idiomaid: 2, valor: categoria.descricaoEN },
                        { chaveid: chave.chaveid, idiomaid: 3, valor: categoria.descricaoES }
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
            const categoria = await models.categoria.create({
                cor: '',
                icone: ''
            });

            const chave = await models.chave.create({
                registoid: categoria.categoriaid,
                entidade: 'CATEGORIA'
            })

            const traducoes = [
                { chaveid: chave.chaveid, idiomaid: 1, valor: descricaoPT },
                { chaveid: chave.chaveid, idiomaid: 2, valor: descricaoEN },
                { chaveid: chave.chaveid, idiomaid: 3, valor: descricaoES }
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
                { chaveid: chave.chaveid, idiomaid: 1, valor: descricaoPT },
                { chaveid: chave.chaveid, idiomaid: 2, valor: descricaoEN },
                { chaveid: chave.chaveid, idiomaid: 3, valor: descricaoES }
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
            const categorias = await models.categoria.findAll({
                include: [{
                    model: models.chave,
                    include: [{
                        model: models.traducao
                    }]
                }]
            });
            
            res.status(200).json(categorias);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar as categorias', details: error.message });
        }
    }
};

module.exports = controladorCategorias;
