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
            poloid,
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
                utilizadorcriou: utilizadorcriou,
                poloid: poloid
            });

            await models.itemcomentario.create({
                registoid: pontointeresse.pontointeresseid,
                tipo: 'POI'
            });

            await models.itemavaliacao.create({
                itemorigid: pontointeresse.pontointeresseid,
                tipoentidade: 'POI'
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

    adicionarMobile: async (req, res) => {
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
            poloid,
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
                utilizadorcriou: utilizadorcriou,
                poloid: poloid
            });

            await models.itemcomentario.create({
                registoid: pontointeresse.pontointeresseid,
                tipo: 'POI'
            });

            await models.itemavaliacao.create({
                itemorigid: pontointeresse.pontointeresseid,
                tipoentidade: 'POI'
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
                        await models.respostadetalhe.create({
                            respostaformularioid: respostaFormulario.respostaformularioid,
                            formulariodetalhesid: resposta.formulariodetalhesid,
                            resposta: resposta.resposta
                        });
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
            poloid,
            imagens,
            formRespostas
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
                cidadeid: cidadeid,
                poloid: poloid
            }, {
                where: {
                    pontointeresseid: idPontoInteresse
                }
            });

            await ficheirosController.removerTodosFicheirosAlbum(idPontoInteresse, 'POI');
            ficheirosController.adicionar(idPontoInteresse, 'POI', imagens, utilizadorid);

            await Promise.all(formRespostas.map(async resposta => {
                if (resposta.type === "TEXTO" || resposta.type === "NUMERICO" || resposta.type === "LOGICO"){
                    await models.respostadetalhe.update({
                        resposta: resposta.text
                    }, {
                        where: {
                            respostadetalheid: resposta.id
                        }
                    });
                } else if (resposta.type === "ESCOLHA_MULTIPLA"){
                    const opcao = resposta.options.find(o => o.selected === true);
                    if (opcao){
                        await models.respostadetalhe.update({
                            resposta: opcao.opcao
                        }, {
                            where: {
                                respostadetalheid: resposta.id
                            }
                        });
                    } else {
                        await models.respostadetalhe.destroy({
                            where: {
                                respostadetalheid: resposta.id
                            }
                        })
                    }
                } else if (resposta.type === "SELECAO"){
                    const respostadetalhe = await models.respostadetalhe.findOne({
                        where: {
                            respostadetalheid: resposta.id
                        }
                    })
                    const respostaformularioid = respostadetalhe.respostaformularioid
                    const formulariodetalhesid = respostadetalhe.formulariodetalhesid

                    await models.respostadetalhe.destroy({
                        where: {
                            formulariodetalhesid: respostadetalhe.formulariodetalhesid
                        }
                    })

                    await Promise.all(resposta.options.map(async opcao => {
                        if (opcao.selected) {
                            await models.respostadetalhe.create({
                                respostaformularioid: respostaformularioid,
                                formulariodetalhesid: formulariodetalhesid,
                                resposta: opcao.opcao
                            });
                        }
                    }));
                }
            }));

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

            const poi = await models.pontointeresse.findByPk(idPontoInteresse);

            await models.notificacao.create({
                utilizadorid: poi.utilizadorcriou,
                notificacao: `O ponto de interesse '${poi.titulo}' foi aprovado!`,
                tipo: 'POI',
                idregisto: idPontoInteresse
            });

            await sequelizeConn.query(
                `INSERT INTO NOTIFICACAO (UTILIZADORID, NOTIFICACAO, TIPO, idregisto)
                SELECT 
                    sfav.utilizadorid,
                    CONCAT('Ponto de interesse ', '${poi.titulo}', ' foi criado!'),
                    'POI',
                    ${idPontoInteresse}
                FROM 
                    subcategoria_fav_util sfav
                INNER JOIN
                    utilizador u ON sfav.utilizadorid = u.utilizadorid
                WHERE
                    sfav.subcategoriaid = ${poi.subcategoriaid}
                    AND u.poloid = ${poi.poloid}
                    AND u.inactivo = false
                    AND u.utilizadorid <> ${poi.utilizadorcriou}
                `
            );

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

            const poi = await models.pontointeresse.findByPk(idPontoInteresse);

            await models.notificacao.create({
                utilizadorid: poi.utilizadorcriou,
                notificacao: `O ponto de interesse '${poi.titulo}' foi rejeitado!`,
                tipo: 'POI',
                idregisto: idPontoInteresse
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
            const pontosInteresse = await sequelizeConn.query(
                `SELECT 
                    p.*, 
                    u.*,
                    COALESCE(ROUND(AVG(a.avaliacao), 2), 0) as avgAvaliacao
                FROM 
                    pontointeresse p
                INNER JOIN
                    utilizador u ON p.utilizadorcriou = u.utilizadorid
                LEFT JOIN 
                    itemavaliacao av ON p.pontointeresseid = av.itemorigid AND av.tipoentidade = 'POI'
                LEFT JOIN
                    avaliacao a ON av.itemavaliacaoid = a.itemavaliacaoid
                GROUP BY
                    p.pontointeresseid, u.utilizadorid
                `,
                { type: QueryTypes.SELECT }
            );

            res.status(200).json({ message: 'Consulta realizada com sucesso', data: pontosInteresse });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar os pontos de interesse', details: error.message });
        }
    },

    consultarTudoAprovado: async (req, res) => {
        const { poloid } = req.query
        try {
            let whereClause = ''
            if (poloid && poloid > 0){
                whereClause += `AND p.poloid = ${poloid}`
            }

            const pontosInteresse = await sequelizeConn.query(
                `SELECT 
                    p.*, 
                    u.*,
                    s.categoriaID,
                    COALESCE(ROUND(AVG(a.avaliacao), 2), 0) as avgAvaliacao,
                    p.poloid as poipoloid
                FROM 
                    pontointeresse p
                INNER JOIN
                    utilizador u ON p.utilizadorcriou = u.utilizadorid
                LEFT JOIN 
                    itemavaliacao av ON p.pontointeresseid = av.itemorigid AND av.tipoentidade = 'POI'
                LEFT JOIN
                    avaliacao a ON av.itemavaliacaoid = a.itemavaliacaoid
                INNER JOIN
                    subcategoria s ON p.subcategoriaid = s.subcategoriaid
                WHERE
                    p.aprovado = true 
                    ${whereClause}
                GROUP BY
                    p.pontointeresseid, u.utilizadorid, s.categoriaid
                `,
                { type: QueryTypes.SELECT }
            );

            await Promise.all(pontosInteresse.map(async (poi) => {
                const ficheiros = await ficheirosController.getAllFilesByAlbum(poi.pontointeresseid, 'POI');
                const imagens = ficheiros ? ficheiros.map(file => file.url) : [];
    
                poi.imagem = imagens || [];

                const formulario = await sequelizeConn.query(
                    `SELECT 
                        rd.respostadetalheid AS id,
                        rd.resposta, 
                        fd.formulariodetalhesid,
                        fd.pergunta
                    FROM 
                        respostadetalhe rd
                    INNER JOIN
                        formulariodetalhes fd on fd.formulariodetalhesid = rd.formulariodetalhesid
                    WHERE
                        rd.respostaformularioid IN (
                            SELECT respostaformularioid
                            FROM respostaformulario
                            WHERE itemrespostaformularioid IN (
                                SELECT itemrespostaformularioid
                                FROM itemrespostaformulario
                                WHERE 
                                    registoid = ${poi.pontointeresseid}
                                    AND entidade = 'POI'
                            )
                        )
                    ORDER BY
                        fd.ordem asc
                    `
                );
                const form = formulario[0].reduce((acc, curr) => {
                    const existing = acc.find(item => item.formulariodetalhesid === curr.formulariodetalhesid);
                    
                    if (existing) {
                        existing.resposta = existing.resposta ? existing.resposta + ', ' + curr.resposta : curr.resposta;
                    } else {
                        acc.push({ 
                            pergunta: curr.pergunta, 
                            resposta: curr.resposta 
                        });
                    }
                    return acc;
                }, []);
                
                poi.formRespostas = form || [];
            }));
            
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

            const avgAvaliacao = await models.avaliacao.findOne({
                attributes: [
                    [Sequelize.fn('AVG', Sequelize.col('avaliacao')), 'averageRating']
                ],
                include: [
                    {
                        model: models.itemavaliacao,
                        as: 'itemavaliacao',
                        where: {
                            itemorigid: idPontoInteresse,
                            tipoentidade: 'POI'
                        }
                    }
                ],
                group: ['itemavaliacao.itemavaliacaoid'],
            });

            POI.dataValues.avgAvaliacao = avgAvaliacao ? parseFloat(avgAvaliacao.dataValues.averageRating).toFixed(2) : null;

            const formulario = await sequelizeConn.query(
                `SELECT 
                    rd.respostadetalheid AS id,
                    rd.resposta, 
                    fd.*
                FROM 
                    respostadetalhe rd
                INNER JOIN
                    formulariodetalhes fd on fd.formulariodetalhesid = rd.formulariodetalhesid
                WHERE
                    rd.respostaformularioid IN (
                        SELECT respostaformularioid
                        FROM respostaformulario
                        WHERE itemrespostaformularioid IN (
                            SELECT itemrespostaformularioid
                            FROM itemrespostaformulario
                            WHERE 
                                registoid = ${idPontoInteresse}
                                AND entidade = 'POI'
                        )
                    )
                ORDER BY
                    fd.ordem asc
                `
            );
            const form = formulario[0].reduce((acc, curr) => {
                const existing = acc.find(item => item.formulariodetalhesid === curr.formulariodetalhesid);
                
                if (existing) {
                    existing.resposta = existing.resposta ? existing.resposta + ', ' + curr.resposta : curr.resposta;
                } else {
                    acc.push({ ...curr });
                }
                return acc;
            }, []);
            
            POI.dataValues.formdata = form;

            res.status(200).json({ message: 'Consulta realizada com sucesso', data: POI });
        } catch (error) {
            console.error('Erro ao adicionar ponto de interesse', error);
            res.status(500).json({ error: 'Erro ao consultar o evento', error: error});
        }
    },

    consultarPorAprovar: async (req, res) => {
        const { descricao, poloid } = req.query;

        try {
            let whereClause = {
                aprovado: null,
                titulo: {
                    [Op.like]: `%${descricao}%`
                }
            };

            if (poloid) {
                whereClause.poloid = poloid;
            }

            const pontosInteresse = await models.pontointeresse.findAll({
                include: {
                    model: models.utilizador,
                    as: 'utilizadorcriou_utilizador',
                    attributes: ['pnome', 'unome']
                },
                where: whereClause
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
        const { estado, categoria, descricao, poloid } = req.query;

        try {
            let whereClause = '';
            if (estado === "NULL") {
                whereClause += ` AND p.aprovado IS NULL`;
            } else if(estado !== undefined) {
                whereClause += ` AND p.aprovado = ${estado}`;
            }

            if (categoria > 0){
                whereClause += ` AND p.subcategoriaid IN (SELECT subcategoriaid FROM subcategoria WHERE categoriaid = ${categoria}) `;
            }

            if (poloid) {
                whereClause += ` AND p.poloid = ${poloid}`;
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

    consultarPontIntTotal: async (req, res) => {
        try {
            const pontosInt = await sequelizeConn.query(
                `SELECT 
                    COUNT(p.pontointeresseid) AS pontointeresse
                FROM 
                    pontointeresse p
                `,
                { type: QueryTypes.SELECT }
            );
    
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: pontosInt });
        } catch (error) {
            console.error('Erro ao consultar publicações por mês:', error.message);
            res.status(500).json({ error: 'Erro ao consultar publicações', details: error.message });
        }
    },
    consultarPontoInteressePorId: async (req, res) => {
        const { idPontoInteresse } = req.params;
        try {
            const pontosInteresse = await sequelizeConn.query(
                `SELECT 
                    p.*, 
                    u.*,
                    s.categoriaID,
                    COALESCE(ROUND(AVG(a.avaliacao), 2), 0) as avgAvaliacao
                FROM 
                    pontointeresse p
                INNER JOIN
                    utilizador u ON p.utilizadorcriou = u.utilizadorid
                LEFT JOIN 
                    itemavaliacao av ON p.pontointeresseid = av.itemorigid AND av.tipoentidade = 'POI'
                LEFT JOIN
                    avaliacao a ON av.itemavaliacaoid = a.itemavaliacaoid
                INNER JOIN
                    subcategoria s ON p.subcategoriaid = s.subcategoriaid
                WHERE
                    p.aprovado = true AND p.pontointeresseid = :idPontoInteresse
                GROUP BY
                    p.pontointeresseid, u.utilizadorid, s.categoriaid
                `,
                { 
                    type: QueryTypes.SELECT,
                    replacements: { idPontoInteresse }
                }
            );
    
            // Verificar se o ponto de interesse foi encontrado
            if (pontosInteresse.length === 0) {
                return res.status(404).json({ message: 'Ponto de interesse não encontrado' });
            }
    
            // Obter os detalhes adicionais para o ponto de interesse encontrado
            const poi = pontosInteresse[0];
            const ficheiros = await ficheirosController.getAllFilesByAlbum(poi.pontointeresseid, 'POI');
            const imagens = ficheiros ? ficheiros.map(file => file.url) : [];
            poi.imagem = imagens || [];
    
            const formulario = await sequelizeConn.query(
                `SELECT 
                    rd.respostadetalheid AS id,
                    rd.resposta, 
                    fd.formulariodetalhesid,
                    fd.pergunta
                FROM 
                    respostadetalhe rd
                INNER JOIN
                    formulariodetalhes fd on fd.formulariodetalhesid = rd.formulariodetalhesid
                WHERE
                    rd.respostaformularioid IN (
                        SELECT respostaformularioid
                        FROM respostaformulario
                        WHERE itemrespostaformularioid IN (
                            SELECT itemrespostaformularioid
                            FROM itemrespostaformulario
                            WHERE 
                                registoid = ${poi.pontointeresseid}
                                AND entidade = 'POI'
                        )
                    )
                ORDER BY
                    fd.ordem asc
                `
            );
    
            const form = formulario[0].reduce((acc, curr) => {
                const existing = acc.find(item => item.formulariodetalhesid === curr.formulariodetalhesid);
                
                if (existing) {
                    existing.resposta = existing.resposta ? existing.resposta + ', ' + curr.resposta : curr.resposta;
                } else {
                    acc.push({ 
                        pergunta: curr.pergunta, 
                        resposta: curr.resposta 
                    });
                }
                return acc;
            }, []);
            
            poi.formRespostas = form || [];
    
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: poi });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar o ponto de interesse', details: error.message });
        }
    },
    
};

module.exports = controladorPontosInteresse;
