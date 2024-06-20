const { Sequelize, Op, QueryTypes } = require('sequelize');
const initModels = require('../models/init-models');
const sequelizeConn = require('../bdConexao');
const models = initModels(sequelizeConn);
const ficheirosController = require('./ficheiros');

const controladorPontosInteresse = {
    adicionar: async (req, res) => {
        const {
            subcategoriaid,
            titulo,
            descricao,
            localizacao,
            latitude,
            longitude,
            idiomaid,
            cidadeid,
            utilizadorcriou,
            imagens,
            formRespostas
        } = req.body;

        try {
            const pontointeresse = await models.pontointeresse.create({
                subcategoriaid: subcategoriaid,
                titulo: titulo,
                descricao: descricao,
                localizacao: localizacao,
                latitude: latitude,
                longitude: longitude,
                idiomaid: idiomaid,
                cidadeid: cidadeid,
                utilizadorcriou: utilizadorcriou
            });

            await models.objecto.create({
                registoid: pontointeresse.pontointeresseid,
                entidade: 'POI'
            });

            if (formRespostas && formRespostas !== '') {
                const itemResposta = await models.itemrespostaformulario.create({
                    registoid: pontointeresse.pontointeresseid,
                    entidade: 'POI'
                });

                const respostaFormulario = await models.respostaformulario.create({
                    itemrespostaformularioid: itemResposta.itemrespostaformularioid,
                    utilizadorid: utilizadorcriou
                });

                await Promise.all(formRespostas.map(async resposta => {
                    if (resposta.type === "TEXTO" || resposta.type === "NUMERICO" || resposta.type === "LOGICO"){
                        await models.respostadetalhe.create({
                            respostaformularioid: respostaFormulario.respostaformularioid,
                            formulariodetalhesid: resposta.id,
                            resposta: resposta.text
                        });
                    } else if (resposta.type === "ESCOLHA_MULTIPLA"){
                        const opcao = resposta.options.find(o => o.selected === true);
                        if (opcao){
                            await models.respostadetalhe.create({
                                respostaformularioid: respostaFormulario.respostaformularioid,
                                formulariodetalhesid: resposta.id,
                                resposta: opcao.opcao
                            });
                        }
                    } else if (resposta.type === "SELECAO"){
                        await Promise.all(resposta.options.map(async opcao => {
                            if (opcao.selected) {
                                await models.respostadetalhe.create({
                                    respostaformularioid: respostaFormulario.respostaformularioid,
                                    formulariodetalhesid: resposta.id,
                                    resposta: opcao.opcao
                                });
                            }
                        }));
                    }
                }));
            }

            ficheirosController.adicionar(pontointeresse.pontointeresseid, 'POI', imagens, utilizadorcriou);

            res.status(201).json({ message: 'Ponto de interesse adicionado com sucesso' });
        } catch (error) {
            console.error('Erro ao adicionar ponto de interesse', error);
            res.status(500).json({ error: 'Erro ao adicionar ponto de interesse', details: error.message });
        }
    },

    atualizar: async (req, res) => {
        const { idPontoInteresse } = req.params;
        const {
            subcategoriaid,
            titulo,
            descricao,
            localizacao,
            latitude,
            longitude,
            idiomaid,
            cidadeid,
            utilizadorid,
            imagens
        } = req.body;

        try {
            await models.pontointeresse.update({
                subcategoriaid: subcategoriaid,
                titulo: titulo,
                descricao: descricao,
                localizacao: localizacao,
                latitude: latitude,
                longitude: longitude,
                idiomaid: idiomaid,
                cidadeid: cidadeid
            }, {
                where: {
                    pontointeresseid: idPontoInteresse
                }
            });

            await ficheirosController.removerTodosFicheirosAlbum(idPontoInteresse, 'POI');
            ficheirosController.adicionar(idPontoInteresse, 'POI', imagens, utilizadorid);

            res.status(200).json({ message: 'Ponto de interesse atualizado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar ponto de interesse', details: error.message });
        }
    },

    aprovar: async (req, res) => {
        const { idPontoInteresse } = req.params;
        const { userAprovacao } = req.body;
        try {
            await models.pontointeresse.update({
                aprovado: true,
                dataaprovacao: Sequelize.literal('CURRENT_TIMESTAMP'),
                utilizadoraprova: userAprovacao
            }, {
                where: {
                    pontointeresseid: idPontoInteresse
                }
            });

            res.status(200).json({ message: 'Ponto de interesse aprovado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao aprovar ponto de interesse', details: error.message });
        }
    },

    rejeitar: async (req, res) => {
        const { idPontoInteresse } = req.params;
        const { userAprovacao } = req.body;
        try {
            await models.pontointeresse.update({
                aprovado: false,
                dataaprovacao: Sequelize.literal('CURRENT_TIMESTAMP'),
                utilizadoraprova: userAprovacao
            }, {
                where: {
                    pontointeresseid: idPontoInteresse
                }
            });

            res.status(200).json({ message: 'Ponto de interesse rejeitado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao rejeitar ponto de interesse', details: error.message });
        }
    },

    remover: async (req, res) => {
        const { idPontoInteresse } = req.params;

        try {
            await models.objecto.destroy({
                where: {
                    registoid: idPontoInteresse,
                    entidade: 'PONTOINTERESSE'
                }
            });

            await models.pontointeresse.destroy({
                where: {
                    pontointeresseid: idPontoInteresse
                }
            });

            res.status(200).json({ message: 'Ponto de interesse removido com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao remover ponto de interesse', details: error.message });
        }
    },

    consultarTudo: async (req, res) => {
        try {
            const pontosInteresse = await models.pontointeresse.findAll({
                include: {
                    model: models.utilizador,
                    as: 'utilizadorcriou_utilizador'
                },
            });
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: pontosInteresse });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar os pontos de interesse', details: error.message });
        }
    },

    consultarPorID: async (req, res) => {
        const { idPontoInteresse } = req.params;
        try {
            const POI = await models.pontointeresse.findByPk(idPontoInteresse, {
                include: [
                    {
                        model: models.utilizador,
                        as: 'utilizadorcriou_utilizador'
                    },
                    {
                        model: models.subcategoria,
                        as: 'subcategorium'
                    }
                ]
            });

            const ficheiros = await ficheirosController.getAllFilesByAlbum(idPontoInteresse, 'POI');
            POI.dataValues.imagens = ficheiros;

            res.status(200).json({ message: 'Consulta realizada com sucesso', data: POI });
        } catch (error) {
            console.error('Erro ao adicionar ponto de interesse', error);
            res.status(500).json({ error: 'Erro ao consultar o evento' });
        }
    },

    consultarPorAprovar: async (req, res) => {
        const { descricao} = req.query;

        try {
            const pontosInteresse = await models.pontointeresse.findAll({
                include: {
                    model: models.utilizador,
                    as: 'utilizadorcriou_utilizador',
                    attributes: ['pnome', 'unome']
                },
                where:{
                    aprovado: null,
                    titulo: {
                        [Op.like]: `%${descricao}%`
                    }
                }
            });
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: pontosInteresse });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar os pontos de interesse', details: error.message });
        }
    },

    consultarPorSubcategoria: async (req, res) => {
        const { idSubCat } = req.params;

        try {
            const pontosInteresse = await models.pontointeresse.findAll({
                include: {
                    model: models.utilizador,
                    as: 'utilizadorcriou_utilizador'
                },
                where:{
                    subcategoriaid: idSubCat
                }
            });
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: pontosInteresse });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar os pontos de interesse', details: error.message });
        }
    },

    consultarTodosComFiltro: async (req, res) => {
        const { estado, categoria, descricao } = req.query;
        try {
            let whereClause = '';
            if (estado !== undefined) {
                whereClause += ` AND p.aprovado = ${estado}`;
            }

            if (categoria > 0){
                whereClause += ` AND p.subcategoriaid IN (SELECT subcategoriaid FROM subcategoria WHERE categoriaid = ${categoria}) `;
            }

            const pontosInteresse = await sequelizeConn.query(
                `SELECT 
                    p.*, 
                    t.valor as valorpt
                FROM 
                    pontointeresse p
                INNER JOIN 
                    chave ch ON p.subcategoriaid = ch.registoid AND ch.entidade = 'SUBCAT'
                LEFT JOIN 
                    traducao t ON ch.chaveid = t.chaveid AND t.idiomaid = 1
                WHERE
                    p.titulo LIKE '%${descricao}%'
                ${whereClause}
                    `,
                { type: QueryTypes.SELECT }
            );
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: pontosInteresse });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar utilizadores', details: error.message });
        }
    }, 
};

module.exports = controladorPontosInteresse;
