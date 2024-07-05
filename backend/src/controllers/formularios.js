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

    consultarPerguntas: async (req, res) => {
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

    consultarGenericoPorIDVersaoMaisRecente: async (req, res) => {
        const { idForm } = req.params;

        try{
            const results = await sequelizeConn.query(
                `SELECT 
                    f.formularioid,
                    fv.descricao,
                    fd.*,
                    cfg.registoid as subcategoriaid,
                    (SELECT valor FROM traducao WHERE ch.chaveid = traducao.chaveid AND idiomaid = 1) as valorpt
                FROM 
                    FormularioDetalhes fd 
                INNER JOIN
                    formularioversao fv ON fv.formularioversaoid = fd.formularioversaoid
                INNER JOIN
                    formulario f ON f.formularioid = fv.formularioid
                INNER JOIN
                    itemcfgformulario cfg ON cfg.itemcfgformularioid = f.itemcfgformularioid AND tipo = 'SUBCAT'
                INNER JOIN 
                    chave ch ON cfg.registoid = ch.registoid AND ch.entidade = 'SUBCAT'
                WHERE 
                    f.formularioid = ${idForm}
                    AND fv.formularioversaoid = (SELECT max(formularioversaoid) from formularioversao WHERE formularioid = ${idForm})
                `,
                {
                    type: QueryTypes.SELECT
                }
            );

            const formDetails = results.map(row => {
                const { formularioid, descricao, subcategoriaid, valorpt, ...detailColumns } = row;
                return detailColumns;
            });
    
            const response = {
                formularioid: results[0].formularioid,
                descricao: results[0].descricao,
                subcategoriaid: results[0].subcategoriaid,
                valorpt: results[0].valorpt,
                formDetails
            };
    
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar formulario', details: error });
        }
    },

    consultarTodosGenericoVersaoMaisRecente: async (req, res) => {
        try{
            const results = await sequelizeConn.query(
                `SELECT 
                    fd.*,
                    cfg.registoid as subcategoriaid
                FROM 
                    FormularioDetalhes fd 
                INNER JOIN
                    formularioversao fv ON fv.formularioversaoid = fd.formularioversaoid
                INNER JOIN
                    formulario f ON f.formularioid = fv.formularioid
                INNER JOIN
                    itemcfgformulario cfg ON cfg.itemcfgformularioid = f.itemcfgformularioid AND tipo = 'SUBCAT'
                WHERE 
                    fv.formularioversaoid = (SELECT max(formularioversaoid) from formularioversao WHERE formularioid = f.formularioid)
                `,
                {
                    type: QueryTypes.SELECT
                }
            );

            const groupedResults = results.reduce((acc, row) => {
                const { subcategoriaid, ...detailColumns } = row;
                if (!acc[subcategoriaid]) {
                    acc[subcategoriaid] = [];
                }
                acc[subcategoriaid].push(detailColumns);
                return acc;
            }, {});
    
            const response = Object.keys(groupedResults).map(subcategoriaid => ({
                subcategoriaid,
                formDetails: groupedResults[subcategoriaid]
            }));
    
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar formulario', details: error });
        }
    },

    consultarPorSubcatVersaoMaisRecente: async (req, res) => {
        const { idSubcat } = req.params;

        try{
            const results = await sequelizeConn.query(
                `SELECT 
                    fd.*,
                    fv.formularioversaoid
                FROM 
                    FormularioDetalhes fd 
                INNER JOIN
                    formularioversao fv ON fv.formularioversaoid = fd.formularioversaoid
                INNER JOIN
                    formulario f ON f.formularioid = fv.formularioid
                INNER JOIN
                    itemcfgformulario cfg ON cfg.itemcfgformularioid = f.itemcfgformularioid AND tipo = 'SUBCAT'
                WHERE 
                    cfg.registoid = ${idSubcat}
                    AND fv.formularioversaoid = (SELECT max(formularioversaoid) from formularioversao WHERE formularioversao.formularioid = f.formularioid)
                ORDER BY
                    fd.ordem asc
                    `,
                {
                    type: QueryTypes.SELECT
                }
            );
    
            res.status(200).json(results);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar formulario', details: error });
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
    }, 
    getIdFormularioAResponder: async (req, res) => {
        const { idSubcat } = req.params;    
    
        const query = `
            SELECT DISTINCT fm.formularioId 
                FROM formulariodetalhes fd
                INNER JOIN formularioversao fv ON fv.formularioversaoid = fd.formularioversaoid
                INNER JOIN formulario fm ON fm.formularioid = fv.formularioid 
                INNER JOIN itemcfgformulario itf ON itf.itemcfgformularioid = fm.itemcfgformularioid
                AND itf.tipo = 'SUBCAT' and itf.registoid = :idSubcat
        `;
    
        try {
            const formularios = await sequelizeConn.query(query, {
                replacements: { idSubcat },
                type: Sequelize.QueryTypes.SELECT
            });
            console.log(formularios);
    
            // verifica se o evento tem um formulario associado
            const formularioid = formularios.length > 0 ? formularios[0].formularioid : 0;
    
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: formularioid });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao consultar os eventos' });
        }
    },
    getPerguntasFormulario: async (req, res) => {
        const { idFormulario } = req.params;
    
        // Define the SQL queries
        const query = `
            SELECT 
                fm.formularioid AS "formId", 
                fv.descricao AS "titulo"
            FROM formularioversao fv
            INNER JOIN formulario fm ON fm.formularioid = fv.formularioid AND fm.formularioid = :idFormulario
        `;
    
        const query2 = `
            SELECT 
                fd.formulariodetalhesid AS "detalheId", 
                fd.pergunta AS "pergunta", 
                fd.tipodados AS "tipoDados", 
                fd.obrigatorio AS "obrigatorio", 
                fd.minimo AS "min", 
                fd.maximo AS "max", 
                fd.tamanho AS "tamanho", 
                fd.respostasPossiveis AS "valoresPossiveis", 
                fd.ordem AS "ordem"
            FROM formulariodetalhes fd
            WHERE fd.formularioversaoid = (
                SELECT MAX(fv.formularioversaoid) 
                FROM formularioversao fv
                WHERE fv.formularioid = :idFormulario
            )
        `;
    
        try {
            const formularios = await sequelizeConn.query(query, {
                replacements: { idFormulario },
                type: Sequelize.QueryTypes.SELECT
            });
    
            const perguntas = await sequelizeConn.query(query2, {
                replacements: { idFormulario },
                type: Sequelize.QueryTypes.SELECT
            });
    
            // converte os valores possiveis para um array
            const processedPerguntas = perguntas.map(pergunta => {
                if (pergunta.valoresPossiveis) {
                    pergunta.valoresPossiveis = pergunta.valoresPossiveis
                        .split(',')
                        .map(val => val.trim())
                        .filter(val => val);
                } else {
                    pergunta.valoresPossiveis = [];
                }
                return pergunta;
            });
    
            const formData = {
                formId: formularios[0].formId, 
                titulo: formularios[0].titulo,
                perguntas: processedPerguntas
            };
    
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: formData });
    
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar o form' });
        }
    },
    obtemRespostasFormulariosMobile: async (req, res) => {
        const { idRegisto, tabela, idUtilizador, idFormulario } = req.params;
    
        const query = `
            SELECT 
                rd.respostadetalheid AS "respostaId",
                rd.resposta AS "resposta",
                rd.formulariodetalhesid AS "formulariodetalhesid"
            FROM respostadetalhe rd
            INNER JOIN respostaformulario rf ON rd.respostaformularioid = rf.respostaformularioid AND rf.utilizadorid = :idUtilizador
            INNER JOIN itemrespostaformulario irf ON irf.itemrespostaformularioid = rf.itemrespostaformularioid
            AND irf.entidade = :tabela AND irf.registoid = :idRegisto
            INNER JOIN formulariodetalhes fd ON fd.formulariodetalhesid = rd.formulariodetalhesid
            INNER JOIN formularioversao fv ON fv.formularioversaoid = fd.formularioversaoid AND fv.formularioid = :idFormulario
        `;
    
        const query2 = `
            SELECT 
                fd.formulariodetalhesid AS "detalheId", 
                fd.pergunta AS "pergunta", 
                fd.tipodados AS "tipoDados", 
                fd.obrigatorio AS "obrigatorio", 
                fd.minimo AS "min", 
                fd.maximo AS "max", 
                fd.tamanho AS "tamanho", 
                fd.respostasPossiveis AS "valoresPossiveis", 
                fd.ordem AS "ordem"
            FROM formulariodetalhes fd
            WHERE fd.formulariodetalhesid IN (:formulariodetalhesids)
        `;
    
        try {
            const respostas = await sequelizeConn.query(query, {
                replacements: { idRegisto, tabela, idUtilizador, idFormulario },
                type: Sequelize.QueryTypes.SELECT
            });
    
            if (!respostas.length) {
                return res.status(200).json({ message: 'Consulta realizada com sucesso', data: [] });
            }
    
            const formulariodetalhesids = respostas.map(resp => resp.formulariodetalhesid);
    
            const perguntas = await sequelizeConn.query(query2, {
                replacements: { formulariodetalhesids },
                type: Sequelize.QueryTypes.SELECT
            });
    
            const processedPerguntas = perguntas.map(pergunta => {
                if (pergunta.valoresPossiveis) {
                    pergunta.valoresPossiveis = pergunta.valoresPossiveis
                        .split(',')
                        .map(val => val.trim())
                        .filter(val => val);
                } else {
                    pergunta.valoresPossiveis = [];
                }
                return pergunta;
            });
    
            const formData = respostas.map(resposta => ({
                respostaId: resposta.respostaId,
                resposta: resposta.resposta,
                perguntaId: resposta.formulariodetalhesid,
                pergunta: processedPerguntas.find(p => p.detalheId === resposta.formulariodetalhesid)
            }));
    
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: formData });
    
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar as respostas' });
        }
    }
    
    
}

module.exports = controladorFormularios;