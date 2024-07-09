const { Sequelize, Op, where } = require('sequelize');
const initModels = require('../models/init-models');
const sequelizeConn = require('../bdConexao');
const e = require('express');
const models = initModels(sequelizeConn);
const ficheirosController = require('./ficheiros');

const controladorMensagem = {
    adicionar: async (req, res) => {
        const { idRemetente, idDestinatario, tipoDestinatario, mensagem, imagens} = req.body;

        try{
            const destinatario = await models.destinatario.findOne({
                where: {
                    itemdestinatario: idDestinatario,
                    tipo: tipoDestinatario
                }
            });

            const mensagemRtn = await models.mensagem.create({
                destinatarioid: destinatario.destinatarioid,
                mensagem: mensagem,
                remententeid: idRemetente
            });

            await models.objecto.create({
                registoid: mensagemRtn.mensagemid,
                entidade: 'MENSAGEM'
            });
            
            ficheirosController.adicionar(mensagemRtn.mensagemid, 'MENSAGEM', imagens, idRemetente);
            
            res.status(201).json({ message: 'Mensagem adicionada com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao adicionar mensagem', details: error.message });
        }
    },

    remover: async (req, res) => {
        const { id } = req.params;
        
        try {
            await models.objecto.destroy({
                where: {
                    registoid: id,
                    entidade: 'MENSAGEM'
                }
            });

            await models.mensagem.destroy({
                where: {
                    mensagemid: id
                }
            });

            res.status(200).json({ message: 'Mensagem removida com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao removida mensagem', details: error.message });
        }
    },

    consultarTudo: async (req, res) => {
        const { idDestinatario, tipoDestinatario } = req.params;

        try {
            const destinatario = await models.destinatario.findOne({
                where: {
                    itemdestinatario: idDestinatario,
                    tipo: tipoDestinatario
                }
            });
            if (!destinatario) {
                return res.status(404).json({ error: 'Destinatário não encontrado' });
            }
    
            const mensagens = await models.mensagem.findAll({
                where: {
                    destinatarioid: destinatario.destinatarioid
                }
            });
    
            res.status(200).json(mensagens);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar mensagens', details: error.message });
        }
    }, 
    obterListaMensagensMain: async (req, res) => {
        const { idUtilizador } = req.params;
        
        const query = `
            WITH max_messages AS (
                SELECT 
                    MAX(msg.mensagemid) AS mensagemid, 
                    dest.destinatarioid, 
                    dest.tipo, 
                    dest.itemdestinatario
                FROM 
                    destinatario dest
                INNER JOIN 
                    mensagem msg 
                    ON msg.destinatarioid = dest.destinatarioid
                WHERE  
                    (dest.tipo = 'UT' AND dest.itemdestinatario = :idUtilizador) 
                    OR 
                    (dest.tipo = 'GR' AND dest.itemdestinatario IN (
                        SELECT grupoid 
                        FROM utilizador_grupo 
                        WHERE utilizadorid = :idUtilizador
                    ))
                GROUP BY 
                    dest.destinatarioid, 
                    dest.tipo, 
                    dest.itemdestinatario
            )
            SELECT 
                mm.mensagemid, 
                msg.destinatarioid, 
                dest.tipo, 
                dest.itemdestinatario,
                msg.remetenteid, 
                msg.mensagem, 
                msg.datacriacao
            FROM 
                max_messages mm
            INNER JOIN 
                mensagem msg 
                ON msg.mensagemid = mm.mensagemid
            INNER JOIN 
                destinatario dest 
                ON dest.destinatarioid = msg.destinatarioid
            ORDER BY 
                msg.datacriacao DESC;
        `;
    
        try {
            const mensagens = await sequelizeConn.query(query, {
                replacements: { idUtilizador },
                type: Sequelize.QueryTypes.SELECT
            });
    
            const utilizadorActual = await models.utilizador.findOne({
                attributes: ['utilizadorid', 'pnome', 'unome', 'email', 'poloid'],
                where: {
                    utilizadorid: idUtilizador
                }
            });
    
            const ficheiros = await ficheirosController.getAllFilesByAlbum(utilizadorActual.utilizadorid, 'UTIL');
            const fotoUrl = ficheiros[0] ? ficheiros[0].url : '';
            const utilizadorActualWithFoto = { ...utilizadorActual.get(), fotoUrl };
    
            const mensagensDetalhadas = await Promise.all(mensagens.map(async (mensagem) => {
                let destinatarioUtil = null;
                let destinatarioGrupo = null;
                let remetente = null;
    
                if (mensagem.tipo === 'UT' && mensagem.itemdestinatario === idUtilizador) {
                    destinatarioUtil = utilizadorActualWithFoto;
                } else if (mensagem.tipo === 'UT' && mensagem.itemdestinatario !== idUtilizador) {
                    destinatarioUtil = await models.utilizador.findOne({
                        attributes: ['utilizadorid', 'pnome', 'unome', 'email', 'poloid'],
                        where: {
                            utilizadorid: mensagem.remetenteid
                        }
                    });
                    const ficheiros = await ficheirosController.getAllFilesByAlbum(destinatarioUtil.utilizadorid, 'UTIL');
                    const fotoUrl = ficheiros[0] ? ficheiros[0].url : '';
                    destinatarioUtil = { ...destinatarioUtil.get(), fotoUrl };
                    destinatarioGrupo = null;
                } else if (mensagem.tipo === 'GR') {
                    destinatarioUtil = null;
                    destinatarioGrupo = await models.grupo.findOne({
                        attributes: ['grupoid', 'nome', 'descricao'],
                        where: {
                            grupoid: mensagem.itemdestinatario
                        }
                    });
                    const ficheiros = await ficheirosController.getAllFilesByAlbum(destinatarioGrupo.grupoid, 'GRUPO');
                    const fotoUrl1 = ficheiros[0] ? ficheiros[0].url : '';
                    destinatarioGrupo = { ...destinatarioGrupo.get(), fotoUrl1 };
                }
    
                if (mensagem.remetenteid === idUtilizador) {
                    remetente = utilizadorActualWithFoto;
                } else {
                    remetente = await models.utilizador.findOne({
                        attributes: ['utilizadorid', 'pnome', 'unome', 'email', 'poloid'],
                        where: {
                            utilizadorid: mensagem.remetenteid
                        }
                    });
                    const ficheiros = await ficheirosController.getAllFilesByAlbum(remetente.utilizadorid, 'UTIL');
                    const fotoUrl = ficheiros[0] ? ficheiros[0].url : '';
                    remetente = { ...remetente.get(), fotoUrl };
                }
    
                return {
                    ...mensagem,
                    destinatarioUtil, 
                    destinatarioGrupo,
                    remetente
                };
            }));
    
            res.status(200).json({ mensagem: "Mensagens obtidas com sucesso", data: mensagensDetalhadas });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar mensagens', details: error.message });
        }
    }, 
    buscarConversacaoEntreUtils: async (req, res) => {
        const { idConversa } = req.params;
    
        const query = `
            SELECT 
                mensagem.remetenteid, 
                destinatario.itemdestinatario
            FROM 
                mensagem 
            INNER JOIN 
                destinatario 
                ON destinatario.destinatarioid = mensagem.destinatarioid
            WHERE 
                mensagemid = :idConversa;
        `;
    
        const query2 = `
            SELECT 
                msg.mensagemid, 
                msg.destinatarioid, 
                dest.tipo, 
                dest.itemdestinatario, 
                msg.remetenteid, 
                msg.mensagem, 
                msg.datacriacao
            FROM 
                mensagem msg
            INNER JOIN 
                destinatario dest 
                ON msg.destinatarioid = dest.destinatarioid
            WHERE 
                (msg.remetenteid = :variavel1 AND dest.itemdestinatario = :variavel2) 
                OR 
                (msg.remetenteid = :variavel2 AND dest.itemdestinatario = :variavel1)
            ORDER BY 
                msg.datacriacao ASC;
        `;
    
        try {
            // Primeiro, obter as variáveis necessárias para a consulta
            const variaveis = await sequelizeConn.query(query, {
                replacements: { idConversa },
                type: Sequelize.QueryTypes.SELECT
            });
    
            if (variaveis.length === 0) {
                return res.status(404).json({ error: 'Conversa não encontrada' });
            }
    
            const { remetenteid, itemdestinatario } = variaveis[0];
    
            // Em seguida, obter as mensagens com base nas variáveis
            const mensagens = await sequelizeConn.query(query2, {
                replacements: { variavel1: remetenteid, variavel2: itemdestinatario },
                type: Sequelize.QueryTypes.SELECT
            });
    
            // Buscar os detalhes dos utilizadores
            const utilizador1 = await getUserDetails(remetenteid);
            const utilizador2 = await getUserDetails(itemdestinatario);
    
            // Mapear as mensagens com os detalhes dos utilizadores
            const mensagensComDetalhes = mensagens.map(mensagem => {
                const remetente = mensagem.remetenteid === utilizador1.utilizadorid ? utilizador1 : utilizador2;
                const destinatarioUtil = mensagem.remetenteid === utilizador1.utilizadorid ? utilizador2 : utilizador1;
                return { ...mensagem, remetente, destinatarioUtil };
            });
    
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: mensagensComDetalhes });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar mensagens', details: error.message });
        }
    },  // Função auxiliar para obter detalhes de um utilizador
     
    
    

}

const getUserDetails = async (utilizadorid) => {
    const utilizador = await models.utilizador.findOne({
        attributes: ['utilizadorid', 'pnome', 'unome', 'email', 'poloid'],
        where: { utilizadorid }
    });

    const ficheiros = await ficheirosController.getAllFilesByAlbum(utilizadorid, 'UTIL');
    const fotoUrl = ficheiros[0] ? ficheiros[0].url : '';

    return { ...utilizador.get(), fotoUrl };
};

module.exports = controladorMensagem;