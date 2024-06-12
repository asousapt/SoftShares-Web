const { Sequelize, Op, QueryTypes } = require('sequelize');
const initModels = require('../models/init-models');
const sequelizeConn = require('../bdConexao');
const models = initModels(sequelizeConn);

const controladorFormularios = {
    adicionar: async (req, res) => {
        const { idRegisto, tipoConfig, tipoForm, descForm, perguntas } = req.body;

        try {
            const cfgFormulario = await models.itemcfgformulario.create({
                registoid: idRegisto,
                tipo: tipoConfig
            });

            const formulario = await models.formulario.create({
                itemcfgformularioid: cfgFormulario.itemcfgformularioid,
                tipoformulario: tipoForm
            });

            const versao = await models.formularioversao.create({
                formularioid: formulario.formularioid,
                descricao: descForm,
            });

            await Promise.all(perguntas.map(async pergunta => {
                await models.formulariodetalhes.create({
                    formularioversaoid: versao.formularioversaoid,
                    pergunta: pergunta.text,
                    tipodados: pergunta.type,
                    obrigatorio: pergunta.required,
                    minimo: pergunta.minValue,
                    maximo: pergunta.maxValue,
                    ordem: pergunta.order,
                    respostaspossiveis: pergunta.options.join(", ")
                });
            }));

            res.status(201).json({ message: 'Formulario adicionado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao adicionar formulario', details: error.message });
        }
    },

    adicionarVersao: async (req, res) => {
        const { formularioid } = req.params;
        const { descForm, perguntas } = req.body;
        
        try{
            const versao = await models.formularioversao.create({
                formularioid: formularioid,
                descricao: descForm,
            });

            await Promise.all(perguntas.map(async pergunta => {
                await models.formulariodetalhes.create({
                    formularioversaoid: versao.formularioversaoid,
                    pergunta: pergunta.pergunta,
                    tipodados: pergunta.tipoDados,
                    obrigatorio: Boolean(pergunta.obrigatorio),
                    minimo: pergunta.minimo,
                    maximo: pergunta.maximo,
                    ordem: pergunta.ordem
                });
            }));
            res.status(201).json({ message: 'Formulario adicionado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao adicionar formulario', details: error.message });
        }
    },

    adicionarResposta: async (req, res) => {
        const { idRegisto, tabela, userID, respostas } = req.body;

        try {
            const configrespostaformulario = await models.itemrespostaformulario.create({
                registoid: idRegisto,
                tipo: tabela
            });

            const respostaformulario = await models.respostaformulario.create({
                itemrespostaformularioid: configrespostaformulario.itemrespostaformularioid,
                utilizadorid: userID
            });

            await Promise.all(respostas.map(async resposta => {
                await models.respostadetalhe.create({
                    respostaformularioid: respostaformulario.respostaformularioid,
                    formulariodatalhesid: resposta.perguntaid,
                    resposta: resposta.resposta
                });
            }));

            res.status(201).json({ message: 'Resposta adicionado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao adicionar resposta', details: error.message });
        }
    },

    consultarFormulario: async (req, res) => {
        const { id, tabela } = req.params;

        try{
            const cfgFormulario = await models.itemcfgformulario.findOne({
                where: {
                    registoid: id,
                    tipo: tabela
                }
            });
            if (!cfgFormulario) {
                return res.status(404).json({ error: 'Configuração não encontrada' });
            }

            const formulario = await models.formulario.findOne({
                where: {
                    itemcfgformularioid: cfgFormulario.itemcfgformularioid
                }
            });
            if (!formulario) {
                return res.status(404).json({ error: 'Formulario não encontrado' });
            }

            const versao = await models.formularioversao.findOne({
                where: {
                    formularioid: formulario.formularioid
                },
                order: [['datacriacao', 'DESC']]
            });
            if (!versao) {
                return res.status(404).json({ error: 'Versão do formulario não encontrada' });
            }

            const detalhes = await models.formulariodetalhes.findAll({
                where: {
                    formularioversaoid: versao.formularioversaoid
                }
            });

            res.status(200).json(detalhes);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar formulario', details: error.message });
        }
    },

    consultarGenericosComFiltro: async (req, res) => {
        const { categoria, descricao } = req.query;

        try{
            let whereClause = '';
    
            if (categoria > 0) {
                whereClause += ` AND cfg.registoid IN (SELECT subcategoriaid FROM subcategoria WHERE categoriaid = ${categoria})`;
            }

            const forms = await sequelizeConn.query(
                `SELECT 
                    f.formularioid,
                    count(fv.formularioversaoID) AS versao,
                    fv.descricao,
                    (SELECT valor FROM traducao WHERE ch.chaveid = traducao.chaveid AND idiomaid = 1) as valorpt
                FROM 
                    formulario f 
                INNER JOIN
                    formularioversao fv on fv.formularioid = f.formularioid
                INNER JOIN
                    itemcfgformulario cfg on cfg.itemcfgformularioid = f.itemcfgformularioid AND tipo = 'SUBCAT'
                INNER JOIN 
                    chave ch ON cfg.registoid = ch.registoid AND ch.entidade = 'SUBCAT'
                WHERE 
                    f.tipoformulario = 'GENERICO'
                    AND fv.descricao LIKE '%${descricao}%'
                    ${whereClause}
                GROUP BY
                    valorpt,
                    descricao,
                    f.formularioid
                ORDER BY 
                    f.formularioid
                `,
                {
                    type: QueryTypes.SELECT
                }
            );

            res.status(200).json(forms);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar formulario', details: error.message });
        }
    },

    consultarRespostasPorFormulario: async (req, res) => {
        const { formularioVersaoid, idRegisto, tabela, userid } = req.params;

        try{
            const configresposta = await models.itemrespostaformulario.findOne({
                where: {
                    registoid: idRegisto,
                    tipo: tabela
                }
            });configresposta
            if (!cfgFormulario) {
                return res.status(404).json({ error: 'Configuração não encontrada' });
            }

            const respostaformulario = await models.respostaformulario.findOne({
                where: {
                    itemrespostaformularioid: configresposta.itemrespostaformularioid,
                    utilizadorid: userid
                }
            });
            if (!respostaformulario) {
                return res.status(404).json({ error: 'Respostas não encontrado' });
            }

            const detalhes = await models.respostadetalhe.findAll({
                where: {
                    [Op.and]: [
                        {respostaformularioid: respostaformulario.respostaformularioid},
                        Sequelize.literal(`formulariodetalhesid IN (SELECT formulariodetalhesid FROM formulariodetalhes WHERE formularioversao = ${formularioVersaoid})`)
                    ]
                }
            });

            res.status(200).json(detalhes);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar resposta', details: error.message });
        }
    }
}

module.exports = controladorFormularios;