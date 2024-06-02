const { Sequelize, QueryTypes } = require('sequelize');
const initModels = require('../models/init-models');
const sequelizeConn = require('../bdConexao');
const models = initModels(sequelizeConn);

const funcoes = {
    init: async function() {
        try {
            const count = await models.funcao.count();

            if (count < 1) {
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

                const defaultFuncoes = [
                    { descricaoPT: 'Administrador', descricaoEN: 'Administrator', descricaoES: 'Administrador' },
                    { descricaoPT: 'Gerente de Projeto', descricaoEN: 'Project Manager', descricaoES: 'Gerente de Proyecto' },
                    { descricaoPT: 'Desenvolvedor de Software', descricaoEN: 'Software Developer', descricaoES: 'Desarrollador de Software' },
                    { descricaoPT: 'Designer Gráfico', descricaoEN: 'Graphic Designer', descricaoES: 'Diseñador Gráfico' },
                    { descricaoPT: 'Analista de Dados', descricaoEN: 'Data Analyst', descricaoES: 'Analista de Datos' },
                    { descricaoPT: 'Especialista em Marketing', descricaoEN: 'Marketing Specialist', descricaoES: 'Especialista en Marketing' },
                    { descricaoPT: 'Suporte Técnico', descricaoEN: 'Technical Support', descricaoES: 'Soporte Técnico' }
                ];                

                for (const funcao of defaultFuncoes) {
                    const funcaoCreated = await models.funcao.create();

                    const chave = await models.chave.create({ 
                        registoid: funcaoCreated.funcaoid, 
                        entidade: 'FUNCAO' 
                    });

                    const traducoes = [
                        { chaveid: chave.chaveid, idiomaid: idiomas.pt, valor: funcao.descricaoPT },
                        { chaveid: chave.chaveid, idiomaid: idiomas.en, valor: funcao.descricaoEN },
                        { chaveid: chave.chaveid, idiomaid: idiomas.es, valor: funcao.descricaoES }
                    ];
                    await Promise.all(traducoes.map(traducao => models.traducao.create(traducao)));
                }
            }
        } catch (error) {
            console.error('Erro ao inicializar as funções:', error);
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

            const funcao = await models.funcao.create();

            const chave = await models.chave.create({
                registoid: funcao.funcaoid,
                entidade: 'FUNCAO'
            });

            const traducoes = [
                { chaveid: chave.chaveid, idiomaid: idiomas.pt, valor: descricaoPT },
                { chaveid: chave.chaveid, idiomaid: idiomas.en, valor: descricaoEN },
                { chaveid: chave.chaveid, idiomaid: idiomas.es, valor: descricaoES }
            ];
            await Promise.all(traducoes.map(traducao => models.traducao.create(traducao)));

            res.status(201).json({ message: 'Função adicionada com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao adicionar função', details: error.message });
        }
    },

    atualizar: async (req, res) => {
        const { idFuncao } = req.params;
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

            const funcao = await models.funcao.findByPk(idFuncao);
            if (!funcao) {
                return res.status(404).json({ error: 'Função não encontrada' });
            }

            await models.funcao.update({
                inativo: inativo
            }, {
                where: {
                    funcaoid: idFuncao
                }
            });

            const chave = await models.chave.findOne({
                where: {
                    registoid: idFuncao,
                    entidade: 'FUNCAO'
                }
            });
            if (!chave) {
                return res.status(404).json({ error: 'Chave não encontrada para a função' });
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

            res.status(200).json({ message: 'Função atualizada com sucesso' });
        } catch (error) {
            res.status (500).json({ error: 'Erro ao atualizar a função', details: error.message });
        }
    },

    remover: async (req, res) => {
        const { idFuncao } = req.params;

        try {
            const funcao = await models.funcao.findByPk(idFuncao);
            if (!funcao) {
                return res.status(404).json({ error: 'Função não encontrada' });
            }

            const chave = await models.chave.findOne({
                where: {
                    registoid: idFuncao,
                    entidade: 'FUNCAO'
                }
            });
            if (!chave) {
                return res.status(404).json({ error: 'Chave não encontrada para a função' });
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

            await models.funcao.destroy({
                where: {
                    funcaoid: idFuncao
                }
            });

            res.status(200).json({ message: 'Função removida com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao remover a função', details: error.message });
        }
    },

    consultarTudo: async (req, res) => {
        try {
            const funcoes = await sequelizeConn.query(
                `SELECT 
                    f.*, 
                    (SELECT valor from traducao WHERE ch.chaveid = traducao.chaveid AND idiomaID = 1) as ValorPT, 
                    (SELECT valor from traducao WHERE ch.chaveid = traducao.chaveid AND idiomaID = 2) as ValorEN, 
                    (SELECT valor from traducao WHERE ch.chaveid = traducao.chaveid AND idiomaID = 3) as ValorES 
                FROM 
                    funcao f 
                INNER JOIN 
                    chave ch ON f.funcaoid = ch.registoid AND ch.entidade = 'FUNCAO' `,
                {
                    type: QueryTypes.SELECT
                }
            );

            res.status(200).json(funcoes);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar as funções', details: error.message });
        }
    },

    consultarTudoComFiltroPT: async (req, res) => {
        const { estado, descricao } = req.query;
        try {
            let whereClause = '';
            const replacements = {};
    
            if (estado !== undefined) {
                whereClause += ` AND f.inactivo = ${estado}`;
            }
        
            const query = `
                SELECT 
                    f.*, 
                    t.valor AS ValorPT
                FROM 
                    funcao f
                INNER JOIN 
                    chave ch ON f.funcaoid = ch.registoid AND ch.entidade = 'FUNCAO' 
                INNER JOIN 
                    traducao t on ch.chaveid = t.chaveid AND idiomaID = 1
                WHERE 
                    t.valor LIKE '%${descricao}%'
                ${whereClause}
            `;
    
            const funcoes = await sequelizeConn.query(query, {
                type: QueryTypes.SELECT,
                replacements,
            });
    
            res.status(200).json(funcoes);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar os departamentos', details: error.message });
        }
    }
};

module.exports = funcoes;
