const { Sequelize, Op, QueryTypes } = require('sequelize');
const initModels = require('../models/init-models');
const sequelizeConn = require('../bdConexao');
const models = initModels(sequelizeConn);
const ficheirosController = require('./ficheiros');
const subcategoria = require('../models/subcategoria');
const evento = require('../models/evento');
const utilizador = require('../models/utilizador');
const respostaformulario = require('../models/respostaformulario');
const itemrespostaformulario = require('../models/itemrespostaformulario');;
const controladorFormularios = require('./formularios');

const controladorEventos = {
    adicionarEvento: async (req, res) => {
        const {
            titulo,
            descricao,
            dataInicio,
            dataFim,
            dataLimInscricao,
            nmrMaxParticipantes,
            localizacao,
            latitude,
            longitude,
            cidadeID,
            utilizadorCriou,
            subcategoriaId,
            poloId,
            imagens,
            formInsc,
            formQualidade
        } = req.body;
        
        try {
            const evento = await models.evento.create({
                titulo: titulo,
                descricao: descricao,
                datainicio: dataInicio,
                datafim: dataFim,
                dataliminscricao: dataLimInscricao,
                nmrmaxparticipantes: nmrMaxParticipantes,
                localizacao: localizacao,
                latitude: latitude,
                longitude: longitude,
                cidadeid: cidadeID,
                utilizadorcriou: utilizadorCriou,
                subcategoriaid: subcategoriaId,
                poloid: poloId,
                aprovado: null
            });

            await models.objecto.create({
                registoid: evento.eventoid,
                entidade: 'EVENTO'
            });

            ficheirosController.adicionar(evento.eventoid, 'EVENTO', imagens, utilizadorCriou);
            
            if (Array.isArray(formInsc) && formInsc.length > 0) {
                const cfgFormulario = await models.itemcfgformulario.create({
                    registoid: evento.eventoid,
                    tipo: 'EVENTO'
                });

                const formulario = await models.formulario.create({
                    itemcfgformularioid: cfgFormulario.itemcfgformularioid,
                    tipoformulario: "INSCR"
                });

                const versao = await models.formularioversao.create({
                    formularioid: formulario.formularioid,
                    descricao: "Formulario Inscrição Evento " + evento.titulo,
                });

                await Promise.all(formInsc.map(async pergunta => {
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
            }

            if (Array.isArray(formQualidade) && formQualidade.length > 0) {
                const cfgFormulario = await models.itemcfgformulario.create({
                    registoid: evento.eventoid,
                    tipo: 'EVENTO'
                });

                const formulario = await models.formulario.create({
                    itemcfgformularioid: cfgFormulario.itemcfgformularioid,
                    tipoformulario: "QUALIDADE"
                });

                const versao = await models.formularioversao.create({
                    formularioid: formulario.formularioid,
                    descricao: "Formulario Inscrição Evento " + evento.titulo,
                });

                await Promise.all(formQualidade.map(async pergunta => {
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
            }

            res.status(201).json({ message: 'Evento adicionado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao adicionar evento', details: error });
        }
    },

    adicionarParticipante: async (req, res) => {
        const { idUser, idEvento, numConvidados } = req.body;

        try {
            await models.participantes_eventos.create({
                utilizadorid: idUser,
                eventoid: idEvento,
                convidadosadic: numConvidados
            });

            res.status(201).json({ message: 'Evento adicionado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao adicionar evento', error });
        }
    },

    atualizarEvento: async (req, res) => {
        const { idEvento } = req.params;
        const {
            titulo,
            descricao,
            dataInicio,
            dataFim,
            dataLimInscricao,
            nmrMaxParticipantes,
            localizacao,
            latitude,
            longitude,
            cidadeID,
            subcategoriaId,
            poloId,
            utilizadorid,
            imagens,
            cancelado
        } = req.body;

        try {
            await models.evento.update({
                titulo: titulo,
                descricao: descricao,
                datainicio: dataInicio,
                datafim: dataFim,
                dataliminscricao: dataLimInscricao,
                nmrmaxparticipantes: nmrMaxParticipantes,
                localizacao: localizacao,
                latitude: latitude,
                longitude: longitude,
                cidadeid: cidadeID,
                subcategoriaid: subcategoriaId,
                poloid: poloId,
                cancelado: cancelado
            }, {
                where: {
                    eventoid: idEvento
                }
            });

            await ficheirosController.removerTodosFicheirosAlbum(idEvento, 'EVENTO');
            ficheirosController.adicionar(idEvento, 'EVENTO', imagens, utilizadorid);

            res.status(200).json({ message: 'Evento atualizado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar evento' });
        }
    },

    atualizarConvidados: async (req, res) => {
        const { idUser, idEvento } = req.params;
        const { numConvidados } = req.body;

        try {
            await models.participantes_eventos.update({
                convidadosadic: numConvidados
            }, {
                where: {
                    eventoid: idEvento,
                    utilizadorid: idUser
                }
            });

            res.status(200).json({ message: 'Evento atualizado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar evento' });
        }
    },

    removerInscricao: async (req, res) => {
        const { idUser, idEvento } = req.params;

        try {
            await models.participantes_eventos.destroy({
                where: {
                    eventoid: idEvento,
                    utilizadorid: idUser
                }
            });

            res.status(200).json({ message: 'Evento atualizado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar evento' });
        }
    },

    aprovarEvento: async (req, res) => {
        const { idEvento } = req.params;
        const { userAprovacao } = req.body;

        try {
            await models.evento.update({
                aprovado: true,
                utilizadoraprovou: userAprovacao,
                dataaprovacao: Sequelize.literal('CURRENT_TIMESTAMP')
            }, {
                where: {
                    eventoid: idEvento
                }
            });
            res.status(200).json({ message: 'Evento aprovado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao aprovar o evento' });
        }
    },

    rejeitarEvento: async (req, res) => {
        const { idEvento } = req.params;
        const { userAprovacao } = req.body;
        try {
            await models.evento.update({
                aprovado: false,
                utilizadoraprovou: userAprovacao,
                dataaprovacao: Sequelize.literal('CURRENT_TIMESTAMP')
            }, {
                where: {
                    eventoid: idEvento
                }
            });
            res.status(200).json({ message: 'Evento rejeitado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao rejeitado o evento' });
        }
    },

    cancelarEvento: async (req, res) => {
        const { idEvento } = req.params;

        try {
            await models.evento.update({
                cancelado: 1
            }, {
                where: {
                    eventoid: idEvento
                }
            });
            res.status(200).json({ message: 'Evento cancelado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao cancelar o evento' });
        }
    },

    consultarEventoPorID: async (req, res) => {
        const { idEvento } = req.params;

        try {
            const evento = await models.evento.findByPk(idEvento, {
                include: {
                    model: models.subcategoria,
                    as: 'subcategoria'
                }
            });

            const ficheiros = await ficheirosController.getAllFilesByAlbum(idEvento, 'EVENTO');
            evento.dataValues.imagens = ficheiros;

            res.status(200).json({ message: 'Consulta realizada com sucesso', data: evento });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar o evento' });
        }
    },

    consultarEventosEntreDatas: async (req, res) => {
        const { idPolo, data1, data2, idUtilizador } = req.params;    

        const query = `
            SELECT evento.*, subcategoria.categoriaid,
                    (SELECT STRING_AGG(participantes_eventos.utilizadorid::text, ',')
                    FROM participantes_eventos
                    WHERE participantes_eventos.eventoid = evento.eventoid) AS participantes,
                    (SELECT COUNT(*)
                    FROM participantes_eventos
                    WHERE participantes_eventos.eventoid = evento.eventoid) AS numinscritos
            FROM evento
            JOIN subcategoria ON evento.subcategoriaid = subcategoria.subcategoriaid
            WHERE evento.aprovado = true and evento.datainicio BETWEEN :data1 AND :data2
            AND evento.cidadeid IN (SELECT cidadeid FROM polo WHERE poloid = :idPolo)
            union 
			SELECT evento.*, subcategoria.categoriaid,
                    (SELECT STRING_AGG(participantes_eventos.utilizadorid::text, ',')
                    FROM participantes_eventos
                    WHERE participantes_eventos.eventoid = evento.eventoid) AS participantes,
                    (SELECT COUNT(*)
                    FROM participantes_eventos
                    WHERE participantes_eventos.eventoid = evento.eventoid) AS numinscritos
            FROM evento
            JOIN subcategoria ON evento.subcategoriaid = subcategoria.subcategoriaid
            WHERE evento.utilizadorcriou = :idUtilizador and evento.aprovado = false 
            and evento.dataaprovacao is null and evento.datainicio BETWEEN :data1 AND :data2
            AND evento.cidadeid IN (SELECT cidadeid FROM polo WHERE poloid = :idPolo)
        `;

        try {
            const eventos = await sequelizeConn.query(query, {
                replacements: { idPolo, data1, data2, idUtilizador },
                type: Sequelize.QueryTypes.SELECT
            });

            const processedEventos = await Promise.all(eventos.map(async (evento) => {
                if (evento.participantes) {
                    evento.participantes = evento.participantes.split(',').map(id => parseInt(id, 10));
                } else {
                    evento.participantes = [];
                }

                evento.numinscritos = parseInt(evento.numinscritos, 10);
                const ficheiros = await ficheirosController.getAllFilesByAlbum(evento.eventoid, 'EVENTO');
                evento.imagens = ficheiros ? ficheiros.map(file => file.url) : [];
                return evento;
            }));

            res.status(200).json({ message: 'Consulta realizada com sucesso', data: processedEventos });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao consultar os eventos' });
        }
    },

    consultarUtilizadoresEvento: async (req, res) => {
        const { idEvento } = req.params;

        try {
            const utilizadores = await models.participantes_eventos.findAll({
                where: {
                    eventoid: idEvento
                }
            })
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: utilizadores });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar os participantes' });
        }
    },

    consultarEventoInscritos: async (req, res) => {
        const { idUser } = req.params;

        try {
            const utilizadores = await models.participantes_eventos.findAll({
                where: {
                    [Op.and]: [
                        { utilizadorid: idUser },
                        Sequelize.literal(`dataInicio >= SYSDATE`)
                    ]
                }
            })
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: utilizadores });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar os eventos' });
        }
    },

    consultarEventosFuturos: async (req, res) => {
        const { idPolo, numTop } = req.params;

        try {
            const utilizadores = await models.evento.findAll({
                limit: numTop,
                where: {
                    [Op.and]: [
                        Sequelize.literal(`cidadeID IN (SELECT CIDADEID FROM POLO WHERE POLOID = ${idPolo})`),
                        Sequelize.literal(`dataInicio >= SYSDATE)`)
                    ]
                }
            })
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: utilizadores });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar os participantes' });
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

            const evento = await models.evento.findAll({
                include: {
                    model: models.utilizador,
                    as: 'utilizadorcriou_utilizador',
                    attributes: ['pnome', 'unome']
                },
                where: whereClause
            });

            res.status(200).json({ message: 'Consulta realizada com sucesso', data: evento });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar utilizador', details: error.message });
        }
    },

    consultarTodos: async (req, res) => {
        try {
            const evento = await models.evento.findAll();
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: evento });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar utilizador', details: error.message });
        }
    },

    consultarTodosComFiltro: async (req, res) => {
        const { estado, categoria, descricao, poloid } = req.query;
        console.log(estado);
    
        try {
            let whereClause = 'WHERE e.titulo LIKE :descricao';
            const replacements = { descricao: `%${descricao}%` };
    
            if (estado === "NULL") {
                whereClause += ' AND e.aprovado IS NULL';
            } else if (estado !== undefined) {
                whereClause += ' AND e.aprovado = :estado';
                replacements.estado = estado;
            }
    
            if (categoria > 0) {
                whereClause += ' AND e.subcategoriaid IN (SELECT subcategoriaid FROM subcategoria WHERE categoriaid = :categoria)';
                replacements.categoria = categoria;
            }
    
            if (poloid) {
                whereClause += ' AND e.poloid = :poloid';
                replacements.poloid = poloid;
            }
    
            const eventos = await sequelizeConn.query(
                `SELECT 
                    e.*, 
                    t.valor as valorpt,
                    (SELECT COUNT(pe.participantes_eventosid) FROM participantes_eventos pe WHERE pe.eventoid = e.eventoid) as numinscritos,
                    (SELECT COALESCE(SUM(pe.convidadosadic), 0) FROM participantes_eventos pe WHERE pe.eventoid = e.eventoid) as numconvidados
                FROM 
                    evento e
                INNER JOIN 
                    chave ch ON e.subcategoriaid = ch.registoid AND ch.entidade = 'SUBCAT'
                LEFT JOIN 
                    traducao t ON ch.chaveid = t.chaveid AND t.idiomaid = 1
                ${whereClause}`,
                { 
                    replacements, 
                    type: QueryTypes.SELECT 
                }
            );
    
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: eventos });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar eventos', details: error.message });
        }
    },
    // retorna o numero de perguntas para o questionarios de inscrição e qualidade
    getIdFormularioAResponder: async (req, res) => {
        const { idEvento, tipoForm } = req.params;    
    
        const query = `
            SELECT DISTINCT fm.formularioId 
            FROM formulariodetalhes fd
            INNER JOIN formularioversao fv ON fv.formularioversaoid = fd.formularioversaoid
            INNER JOIN formulario fm ON fm.formularioid = fv.formularioid AND fm.tipoformulario = :tipoForm
            INNER JOIN itemcfgformulario itf ON itf.itemcfgformularioid = fm.itemcfgformularioid
            AND itf.tipo = 'EVENTO' AND itf.registoid = :idEvento
        `;
    
        try {
            const eventos = await sequelizeConn.query(query, {
                replacements: { idEvento, tipoForm },
                type: Sequelize.QueryTypes.SELECT
            });
    
            // verifica se o evento tem um formulario associado
            const formularioid = eventos.length > 0 ? eventos[0].formularioid : 0;
    
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
                fv.descricao AS "titulo",
                fm.tipoformulario AS "tipoFormulario"
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
            const eventos = await sequelizeConn.query(query, {
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
                formId: eventos[0].formId, 
                titulo: eventos[0].titulo,
                tipoFormulario: eventos[0].tipoFormulario,
                perguntas: processedPerguntas
            };
    
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: formData });
    
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar os eventos' });
        }
    }, 
    // endpoint para inscrição no evento 
    inscricaoEvento: async (req, res) => {
        try {
            const { idEvento, idUser, numConvidados, respostas } = req.body;

            const participante = await models.participantes_eventos.create({
                utilizadorid: idUser,
                eventoid: idEvento,
                convidadosadic: numConvidados
            });
    
            if (respostas.length > 0) {
                const itemRespostaFormulario = await models.itemrespostaformulario.create({
                    registoid: idEvento,
                    entidade: 'EVENTO'
                });
    
                const respostaFormulario = await models.respostaformulario.create({
                    itemrespostaformularioid: itemRespostaFormulario.itemrespostaformularioid,
                    utilizadorid: idUser
                });
    
                await Promise.all(respostas.map(async resposta => {
                    await models.respostadetalhe.create({
                        respostaformularioid: respostaFormulario.respostaformularioid,
                        formulariodetalhesid: resposta.formulariodetalhesid,
                        resposta: resposta.resposta
                    });
                }));
            }
    
            res.status(201).json({ message: 'Inscrição realizada com sucesso', data: participante });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao inscrever no evento' });
        }
    }, 
    buscaEventoPorIdEditar: async (req, res) => {
        const { idEvento } = req.params;
        try {
            const evento = await models.evento.findByPk(idEvento, { 
                include: {
                    model: models.subcategoria,
                    as: 'subcategoria'
                }
            
            }); 
    
            const ficheiros = await ficheirosController.getAllFilesByAlbum(idEvento, 'EVENTO');
            evento.dataValues.images = ficheiros;
    
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: { evento } });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar o evento' });
        }
    },
    atualizarEventoMobile: async (req, res) => {
        const { idEvento } = req.params;
        const {
            titulo,
            descricao,
            dataInicio,
            dataFim,
            dataLimInscricao,
            nmrMaxParticipantes,
            localizacao,
            latitude,
            longitude,
            cidadeID,
            subcategoriaId,
            poloId,
            utilizadorid,
            imagens, 
            formInsc,
            formQualidade
        } = req.body;
    
        try {
            await models.evento.update({
                titulo: titulo,
                descricao: descricao,
                datainicio: dataInicio,
                datafim: dataFim,
                dataliminscricao: dataLimInscricao,
                nmrmaxparticipantes: nmrMaxParticipantes,
                localizacao: localizacao,
                latitude: latitude,
                longitude: longitude,
                cidadeid: cidadeID,
                subcategoriaid: subcategoriaId,
                poloid: poloId
            }, {
                where: {
                    eventoid: idEvento
                }
            });
    
            await ficheirosController.removerTodosFicheirosAlbum(idEvento, 'EVENTO');
            await ficheirosController.adicionar(idEvento, 'EVENTO', imagens, utilizadorid);
    
            if (formInsc !== null) {
                if (formInsc.formularioid !== 0) {
                    const versaoInsc = await models.formularioversao.create({
                        formularioid: formInsc.formularioid,
                        descricao: "Formulario Inscrição Evento " + idEvento,
                    });

                    await Promise.all(formInsc.perguntas.map(async pergunta => {
                        await models.formulariodetalhes.create({
                            formularioversaoid: versaoInsc.formularioversaoid,
                            pergunta: pergunta.text,
                            tipodados: pergunta.type,
                            obrigatorio: pergunta.required,
                            minimo: pergunta.minValue,
                            maximo: pergunta.maxValue,
                            tamanho: pergunta.tamanho,
                            ordem: pergunta.order,
                            respostaspossiveis: pergunta.options.join(", ")
                        });
                    }));
                } else {
                    const cfgFormulario = await models.itemcfgformulario.create({
                        registoid: idEvento,
                        tipo: 'EVENTO'
                    });
    
                    const formulario = await models.formulario.create({
                        itemcfgformularioid: cfgFormulario.itemcfgformularioid,
                        tipoformulario: "INSCR"
                    });
    
                    const versaoInsc = await models.formularioversao.create({
                        formularioid: formulario.formularioid,
                        descricao: "Formulario Inscrição Evento " + idEvento,
                    });
    
                    await Promise.all(formInsc.perguntas.map(async pergunta => {
                        await models.formulariodetalhes.create({
                            formularioversaoid: versaoInsc.formularioversaoid,
                            pergunta: pergunta.text,
                            tipodados: pergunta.type,
                            obrigatorio: pergunta.required,
                            minimo: pergunta.minValue,
                            maximo: pergunta.maxValue,
                            tamanho: pergunta.tamanho,
                            ordem: pergunta.order,
                            respostaspossiveis: pergunta.options.join(", ")
                        });
                    }));
                }
            }
    
            if (formQualidade !== null) {
                if (formQualidade.formularioid !== 0) {
                    const versaoQualidade = await models.formularioversao.create({
                        formularioid: formQualidade.formularioid,
                        descricao: "Formulario Qualidade Evento " + idEvento,
                    });
        
                    await Promise.all(formQualidade.perguntas.map(async pergunta => {
                        
                        await models.formulariodetalhes.create({
                            formularioversaoid: versaoQualidade.formularioversaoid,
                            pergunta: pergunta.text,
                            tipodados: pergunta.type,
                            obrigatorio: pergunta.required,
                            minimo: pergunta.minValue,
                            maximo: pergunta.maxValue,
                            tamanho: pergunta.tamanho,
                            ordem: pergunta.order,
                            respostaspossiveis: pergunta.options.join(", ")
                        });
                    }));
                } else {
                    const cfgFormulario = await models.itemcfgformulario.create({
                        registoid: idEvento,
                        tipo: 'EVENTO'
                    });
                    console.log(cfgFormulario.itemcfgformularioid);
                    const formulario = await models.formulario.create({
                        itemcfgformularioid: cfgFormulario.itemcfgformularioid,
                        tipoformulario: "QUALIDADE"
                    });
    
                    const versaoQualidade = await models.formularioversao.create({
                        formularioid: formulario.formularioid,
                        descricao: "Formulario Qualidade Evento " + idEvento,
                    });
    
                    await Promise.all(formQualidade.perguntas.map(async pergunta => {
                        
                        await models.formulariodetalhes.create({
                            formularioversaoid: versaoQualidade.formularioversaoid,
                            pergunta: pergunta.text,
                            tipodados: pergunta.type,
                            obrigatorio: pergunta.required,
                            minimo: pergunta.minValue,
                            maximo: pergunta.maxValue,
                            tamanho: pergunta.tamanho,
                            ordem: pergunta.order,
                            respostaspossiveis: pergunta.options.join(", ")
                        });
                    }));
                }
            }
    
            res.status(200).json({ message: 'Evento atualizado com sucesso' });
        } catch (error) {
            console.error(error);   
            res.status(500).json({ error: 'Erro ao atualizar evento' });
        }
    },
    consultarEventosTotal: async (req, res) => {
        try {
            const eventos = await sequelizeConn.query(
                `SELECT 
                    COUNT(e.eventoid) AS eventos
                FROM 
                    evento e
                `,
                { type: QueryTypes.SELECT }
            );
    
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: eventos });
        } catch (error) {
            console.error('Erro ao consultar publicações por mês:', error.message);
            res.status(500).json({ error: 'Erro ao consultar publicações', details: error.message });
        }
    },
    consultarEventosInscritos: async (req, res) => {
        const { idUtilizador } = req.params;    

        const query = `
            SELECT evento.*, subcategoria.categoriaid,
                (SELECT STRING_AGG(participantes_eventos.utilizadorid::text, ',')
                FROM participantes_eventos
                WHERE participantes_eventos.eventoid = evento.eventoid) AS participantes,
                (SELECT COUNT(*)
                FROM participantes_eventos
                WHERE participantes_eventos.eventoid = evento.eventoid) AS numinscritos
                FROM evento
                JOIN subcategoria ON evento.subcategoriaid = subcategoria.subcategoriaid
                inner join participantes_eventos ON participantes_eventos.eventoid = evento.eventoid 
                and participantes_eventos.utilizadorid = :idUtilizador
                WHERE evento.aprovado = true and evento.datainicio > CURRENT_TIMESTAMP
        `;

        try {
            const eventos = await sequelizeConn.query(query, {
                replacements: { idUtilizador },
                type: Sequelize.QueryTypes.SELECT
            });

            const processedEventos = await Promise.all(eventos.map(async (evento) => {
                if (evento.participantes) {
                    evento.participantes = evento.participantes.split(',').map(id => parseInt(id, 10));
                } else {
                    evento.participantes = [];
                }

                evento.numinscritos = parseInt(evento.numinscritos, 10);
                const ficheiros = await ficheirosController.getAllFilesByAlbum(evento.eventoid, 'EVENTO');
                evento.imagens = ficheiros ? ficheiros.map(file => file.url) : [];
                return evento;
            }));

            res.status(200).json({ message: 'Consulta realizada com sucesso', data: processedEventos });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao consultar os eventos' });
        }
    },
    getparticipantes: async (req, res) => {
        const { idEvento } = req.params;
        try {
            const query = `
            SELECT 
                ut.utilizadorid, 
                ut.pnome, 
                ut.unome, 
                ut.email, 
                ut.poloid 
            FROM participantes_eventos pe
            INNER JOIN utilizador ut ON ut.utilizadorid = pe.utilizadorid 
            WHERE pe.eventoid = :idEvento `;
    
            const participantes = await sequelizeConn.query(query, {
                replacements: { idEvento },
                type: Sequelize.QueryTypes.SELECT
            });
    
            const participantesWithFotos = await Promise.all(
                participantes.map(async participante => {
                    const ficheiros = await ficheirosController.getAllFilesByAlbum(participante.utilizadorid, 'UTIL');
                    const fotoUrl = ficheiros[0] ? ficheiros[0].url : '';
                    participante.fotoUrl = fotoUrl;
                    return participante;
                })
            );
    
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: participantesWithFotos });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar os participantes' });
        }
    }
    
    
};

module.exports = controladorEventos;