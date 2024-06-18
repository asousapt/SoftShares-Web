const { Sequelize, Op, QueryTypes } = require('sequelize');
const initModels = require('../models/init-models');
const sequelizeConn = require('../bdConexao');
const models = initModels(sequelizeConn);
const ficheirosController = require('./ficheiros');

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
            imagens
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
            });

            await models.objecto.create({
                registoid: evento.eventoid,
                entidade: 'EVENTO'
            });

            ficheirosController.adicionar(evento.eventoid, 'EVENTO', imagens, utilizadorCriou);

            res.status(201).json({ message: 'Evento adicionado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao adicionar evento', details: error.message });
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
            imagens
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
        const { idEvento} = req.params;
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
        const { idPolo, data1, data2 } = req.params;

        try {
            const eventos = await models.evento.findAll({
                where: {
                    [Op.and]: [
                        {dataInicio: {[Op.between]: [data1, data2]}},
                        Sequelize.literal(`cidadeID IN (SELECT CIDADEID FROM POLO WHERE POLOID = ${idPolo})`)
                    ]
                }
            })
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: eventos });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar os eventos' });
        }
    },

    consultarUtilizadoresEvento: async (req, res) => {
        const { idEvento } = req.params;

        try{
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

        try{
            const utilizadores = await models.participantes_eventos.findAll({
                where: {
                    [Op.and]: [
                        {utilizadorid: idUser},
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

        try{
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
        console.log('poloid:', poloid);

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
        const { estado, categoria, descricao } = req.query;
        try {
            let whereClause = '';
            if (estado !== undefined) {
                whereClause += ` AND e.aprovado = ${estado}`;
            }

            if (categoria > 0){
                whereClause += ` AND e.subcategoriaid IN (SELECT subcategoriaid FROM subcategoria WHERE categoriaid = ${categoria}) `;
            }

            const eventos = await sequelizeConn.query(
                `SELECT 
                    e.*, 
                    t.valor as valorpt,
                    (SELECT COUNT(pe.participantes_eventosid) FROM participantes_eventos pe WHERE pe.eventoid = e.eventoid ) as numinscritos,
                    (SELECT COALESCE(SUM(pe.convidadosadic), 0) FROM participantes_eventos pe WHERE pe.eventoid = e.eventoid ) as numconvidados
                FROM 
                    evento e
                INNER JOIN 
                    chave ch ON e.subcategoriaid = ch.registoid AND ch.entidade = 'SUBCAT'
                LEFT JOIN 
                    traducao t ON ch.chaveid = t.chaveid AND t.idiomaid = 1
                WHERE
                    e.titulo LIKE '%${descricao}%'
                ${whereClause}
                    `,
                { type: QueryTypes.SELECT }
            );
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: eventos });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar utilizadores', details: error.message });
        }
    }, 
};

module.exports = controladorEventos;