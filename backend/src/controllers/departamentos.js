const { Sequelize, QueryTypes } = require('sequelize');
const initModels = require('../models/init-models');
const sequelizeConn = require('../bdConexao');
const models = initModels(sequelizeConn);

const controladorDepartamentos = {
    init: async function() {
        try {
            const count = await models.departamento.count();

            if (count < 1) {
                const idiomaPT = await models.idioma.findOne({ where: { icone: 'pt' } });
                const idiomaEN = await models.idioma.findOne({ where: { icone: 'en' } });
                const idiomaES = await models.idioma.findOne({ where: { icone: 'es' } });

                const idiomas = {
                    pt: idiomaPT.idiomaid,
                    en: idiomaEN.idiomaid,
                    es: idiomaES.idiomaid,
                };

                const defaultDepartamentos = [
                    { descricaoPT: 'Informática', descricaoEN: 'Computing', descricaoES: 'Informática' },
                    { descricaoPT: 'Recursos Humanos', descricaoEN: 'Human Resources', descricaoES: 'Recursos Humanos' },
                    { descricaoPT: 'Gestão', descricaoEN: 'Management', descricaoES: 'Gestión' }
                ];

                for (const departamento of defaultDepartamentos) {
                    const deptCreated = await models.departamento.create({});

                    const chave = await models.chave.create({
                        registoid: deptCreated.departamentoid,
                        entidade: 'DEPARTAMENTO'
                    });

                    const traducoes = [
                        { chaveid: chave.chaveid, idiomaid: idiomas.pt, valor: departamento.descricaoPT },
                        { chaveid: chave.chaveid, idiomaid: idiomas.en, valor: departamento.descricaoEN },
                        { chaveid: chave.chaveid, idiomaid: idiomas.es, valor: departamento.descricaoES }
                    ];
                    await Promise.all(traducoes.map(traducao => models.traducao.create(traducao)));
                }
            }
        } catch (error) {
            console.error('Erro ao inicializar os departamentos:', error);
        }
    },

    adicionar: async (req, res) => {
        const { descricaoPT, descricaoEN, descricaoES } = req.body;

        try {
            const idiomaPT = await models.idioma.findOne({ where: { icone: 'pt' } });
            const idiomaEN = await models.idioma.findOne({ where: { icone: 'en' } });
            const idiomaES = await models.idioma.findOne({ where: { icone: 'es' } });

            const idiomas = {
                pt: idiomaPT.idiomaid,
                en: idiomaEN.idiomaid,
                es: idiomaES.idiomaid,
            };

            const departamento = await models.departamento.create({});

            const chave = await models.chave.create({
                registoid: departamento.departamentoid,
                entidade: 'DEPARTAMENTO'
            });

            const traducoes = [
                { chaveid: chave.chaveid, idiomaid: idiomas.pt, valor: descricaoPT },
                { chaveid: chave.chaveid, idiomaid: idiomas.en, valor: descricaoEN },
                { chaveid: chave.chaveid, idiomaid: idiomas.es, valor: descricaoES }
            ];
            await Promise.all(traducoes.map(traducao => models.traducao.create(traducao)));

            res.status(201).json({ message: 'Departamento adicionado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao adicionar departamento', details: error.message });
        }
    },

    atualizar: async (req, res) => {
        const { idDepartamento } = req.params;
        const { descricaoPT, descricaoEN, descricaoES, inativo } = req.body;

        try {
            const idiomaPT = await models.idioma.findOne({ where: { icone: 'pt' } });
            const idiomaEN = await models.idioma.findOne({ where: { icone: 'en' } });
            const idiomaES = await models.idioma.findOne({ where: { icone: 'es' } });

            const idiomas = {
                pt: idiomaPT.idiomaid,
                en: idiomaEN.idiomaid,
                es: idiomaES.idiomaid,
            };

            const departamento = await models.departamento.findByPk(idDepartamento);
            if (!departamento) {
                return res.status(404).json({ error: 'Departamento não encontrado' });
            }

            await models.departamento.update({ inativo: inativo }, { where: { departamentoid: idDepartamento } });

            const chave = await models.chave.findOne({
                where: {
                    registoid: idDepartamento,
                    entidade: 'DEPARTAMENTO'
                }
            });
            if (!chave) {
                return res.status(404).json({ error: 'Chave não encontrada para o departamento' });
            }

            const traducoes = [
                { chaveid: chave.chaveid, idiomaid: idiomas.pt, valor: descricaoPT },
                { chaveid: chave.chaveid, idiomaid: idiomas.en, valor: descricaoEN },
                { chaveid: chave.chaveid, idiomaid: idiomas.es, valor: descricaoES }
            ];
            await Promise.all(traducoes.map(async traducao => {
                await models.traducao.update(
                    { valor: traducao.valor },
                    {
                        where: {
                            chaveid: traducao.chaveid,
                            idiomaid: traducao.idiomaid
                        }
                    }
                );
            }));

            res.status(200).json({ message: 'Departamento atualizado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar o departamento', details: error.message });
        }
    },

    remover: async (req, res) => {
        const { idDepartamento } = req.params;

        try {
            const departamento = await models.departamento.findByPk(idDepartamento);
            if (!departamento) {
                return res.status(404).json({ error: 'Departamento não encontrado' });
            }

            const chave = await models.chave.findOne({
                where: {
                    registoid: idDepartamento,
                    entidade: 'DEPARTAMENTO'
                }
            });
            if (!chave) {
                return res.status(404).json({ error: 'Chave não encontrada para o departamento' });
            }

            await models.traducao.destroy({ where: { chaveid: chave.chaveid } });
            await models.chave.destroy({ where: { chaveid: chave.chaveid } });
            await models.departamento.destroy({ where: { departamentoid: idDepartamento } });

            res.status(200).json({ message: 'Departamento removido com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao remover o departamento', details: error.message });
        }
    },

    consultarPorID: async (req, res) => {
        const { idDepartamento } = req.params;
        try {
            const departamento = await sequelizeConn.query(
                `SELECT 
                    c.*, 
                    (SELECT valor FROM traducao WHERE ch.chaveid = traducao.chaveid AND idiomaid = 1) as ValorPT, 
                    (SELECT valor FROM traducao WHERE ch.chaveid = traducao.chaveid AND idiomaid = 2) as ValorEN, 
                    (SELECT valor FROM traducao WHERE ch.chaveid = traducao.chaveid AND idiomaid = 3) as ValorES 
                FROM 
                    departamento c 
                INNER JOIN 
                    chave ch ON c.departamentoid = ch.registoid AND ch.entidade = 'DEPARTAMENTO'
                WHERE c.departamentoid = :idDepartamento`,
                {
                    replacements: { idDepartamento },
                    type: QueryTypes.SELECT
                }
            );

            if (departamento.length === 0) {
                return res.status(404).json({ error: 'Departamento não encontrado' });
            }

            res.status(200).json(departamento[0]);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar o departamento', details: error.message });
        }
    },

    consultarTudo: async (req, res) => {
        try {
            const departamentos = await sequelizeConn.query(
                `SELECT 
                    c.*, 
                    (SELECT valor FROM traducao WHERE ch.chaveid = traducao.chaveid AND idiomaid = 1) as ValorPT, 
                    (SELECT valor FROM traducao WHERE ch.chaveid = traducao.chaveid AND idiomaid = 2) as ValorEN, 
                    (SELECT valor FROM traducao WHERE ch.chaveid = traducao.chaveid AND idiomaid = 3) as ValorES 
                FROM 
                    departamento c 
                INNER JOIN 
                    chave ch ON c.departamentoid = ch.registoid AND ch.entidade = 'DEPARTAMENTO'`,
                { type: QueryTypes.SELECT }
            );

            res.status(200).json(departamentos);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar os departamentos', details: error.message });
        }
    }
};

module.exports = controladorDepartamentos;
