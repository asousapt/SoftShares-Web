const { Sequelize, QueryTypes } = require('sequelize');
const initModels = require('../models/init-models');
const sequelizeConn = require('../bdConexao');
const models = initModels(sequelizeConn);
const ficheirosController = require('./ficheiros');
const sequelize = require('../bdConexao');

const controladorGrupo = {
    adicionar: async (req, res) => {
        const { nome, descricao, publico, subcategoriaid, utilizadorcriou, imagem, users } = req.body;

        try {
            const grupo = await models.grupo.create({
                descricao: descricao,
                nome: nome,
                publico: publico,
                subcategoriaid: subcategoriaid,
                utilizadorcriou: utilizadorcriou
            });

            await models.destinatario.create({
                itemdestinatario: grupo.grupoid,
                tipo: 'GR'
            });

            await models.objecto.create({
                registoid: grupo.grupoid,
                entidade: 'GRUPO'
            });
            
            ficheirosController.adicionar(grupo.grupoid, 'GRUPO', imagem, utilizadorcriou);

            await Promise.all(users.map(async user => {
                await models.utilizador_grupo.create({
                    grupoid: grupo.grupoid,
                    utilizadorid: user.id
                });
            }));

            const destinatario = await models.destinatario.findOne({
                where: {
                    itemdestinatario: utilizadorcriou,
                    tipo: 'UT'
                }
            });

            const mensagemRtn = await models.mensagem.create({
                destinatarioid: destinatario.destinatarioid,
                mensagem: "Grupo foi criado!",
                remententeid: idRemetente
            });

            await models.objecto.create({
                registoid: mensagemRtn.mensagemid,
                entidade: 'MENSAGEM'
            });

            res.status(201).json({ message: 'Grupo adicionado com sucesso', data: true});
        } catch (error) {
            res.status(500).json({ error: 'Erro ao adicionar grupo', details: error.message });
        }
    },

    atualizar: async (req, res) => {
        const { id } = req.params;
        const { nome, descricao, publico, imagem, users } = req.body;

        try {
            const grupo = await models.grupo.findByPk(id);
            if (!grupo) {
                return res.status(404).json({ error: 'Grupo não encontrado' });
            }

            const grupoUpdated = await models.grupo.update({
                descricao: descricao,
                nome: nome,
                publico: publico,
                subcategoriaid: subcategoriaid
            }, {
                where: {
                    grupoid: id
                }
            });

            await models.utilizador_grupo.destroy({
                where: {
                    grupoid: id
                }
            });

            await Promise.all(users.map(async user => {
                await models.utilizador_grupo.create({
                    grupoid: id,
                    utilizadorid: user.id
                });
            }));

            ficheirosController.removerTodosFicheirosAlbum(id, 'GRUPO');
            ficheirosController.adicionar(id, 'GRUPO', imagem, grupoUpdated.utilizadorcriou);

            res.status(200).json({ message: 'Grupo atualizado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar grupo', details: error.message });
        }
    },

    remover: async (req, res) => {
        const { id } = req.params;

        try {
            const grupo = await models.grupo.findByPk(id);
            if (!grupo) {
                return res.status(404).json({ error: 'Grupo não encontrado' });
            }

            await models.destinatario.destroy({
                where: {
                    itemdestinatario: id,
                    tipo: 'GR'
                }
            });

            await models.objecto.destroy({
                where: {
                    registoid: id,
                    entidade: 'GRUPO'
                }
            });

            await models.grupo.destroy({
                where: {
                    grupoid: id
                }
            });

            res.status(200).json({ message: 'Grupo removido com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao remover grupo', details: error.message });
        }
    },

    consultarPorSubcategoria: async (req, res) => {
        const { subcategoriaid } = req.params;

        try {
            const grupos = await models.grupo.findAll({
                where: {
                    subcategoriaid: subcategoriaid
                }
            });

            res.status(200).json({ message: 'Consulta realizada com sucesso', data: grupos });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar grupos por subcategoria', details: error.message });
        }
    },

    consultarPorUtilizador: async (req, res) => {
        const { utilizadorid } = req.params;

        try {
            const grupos = await models.grupo.findAll({
                where: {
                    utilizadorcriou: utilizadorid
                }
            });

            res.status(200).json({ message: 'Consulta realizada com sucesso', data: grupos });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar grupos por utilizador', details: error.message });
        }
    }, 
    listarTodosOsGruposPublicos: async (req, res) => {
        const { utilizadorid } = req.params;
        try {
            const query = `
            select 
                gr.grupoid, 
                gr.nome,
                gr.descricao,
                gr.subcategoriaid, 
                sub.categoriaid
            from grupo gr
            inner join subcategoria sub on sub.subcategoriaid = gr.subcategoriaid
            where gr.publico = true and gr.grupoid not in (
            select utilizador_grupo.grupoid from utilizador_grupo 
            where utilizador_grupo.utilizadorid = :utilizadorid)
            `

            const grupos = await sequelize.query(query, {  
                replacements: { utilizadorid },
                type: QueryTypes.SELECT });

            const gruposFotos = await Promise.all(
                grupos.map(async grupo => {
                    const ficheiros = await ficheirosController.getAllFilesByAlbum(grupo.grupoid, 'GRUPO');
                    const fotoUrl = ficheiros[0] ? ficheiros[0].url : '';
                    
                    return {
                        ...grupo,  
                        fotoUrl
                    };
                })
            );

            res.status(200).json({ message: 'Consulta realizada com sucesso', data: gruposFotos });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao listar todos os grupos públicos', details: error.message });
        }
    }, 
    juntarAoGrupo: async (req, res) => {
        const { grupoid, utilizadorid } = req.body;

        try {
            const grupo = await models.grupo.findByPk(grupoid);
            if (!grupo) {
                return res.status(404).json({ error: 'Grupo não encontrado' });
            }

            await models.utilizador_grupo.create({
                grupoid: grupoid,
                utilizadorid: utilizadorid
            });

            res.status(201).json({ message: 'Utilizador juntou-se ao grupo com sucesso'});
        } catch (error) {
            res.status(500).json({ error: 'Erro ao juntar utilizador ao grupo', details: error.message });
        }
    }, 
    obterDadosGrupo: async (req, res) => { 
        const { grupoid } = req.params;
        try {
            const query = `
            select 
                gr.grupoid, 
                gr.nome,
                gr.descricao,
                gr.subcategoriaid, 
                sub.categoriaid
            from grupo gr
            inner join subcategoria sub on sub.subcategoriaid = gr.subcategoriaid
            where gr.grupoid = :grupoid
            `;
    
            const grupo = await sequelize.query(query, {  
                replacements: { grupoid },
                type: QueryTypes.SELECT
            });
    
            // Assuming you have a 'utilizador' model
            const utilizadorQuery = `
            select 
                ug.utilizadorid,
                u.pnome,
                u.unome,
                u.poloid,
                u.email
            from utilizador_grupo ug
            inner join utilizador u on u.utilizadorid = ug.utilizadorid
            where ug.grupoid = :grupoid
            `;
    
            const utilizadores = await sequelize.query(utilizadorQuery, {
                replacements: { grupoid },
                type: QueryTypes.SELECT
            });
    
            const utilizadoresComFotos = await Promise.all(
                utilizadores.map(async utilizador => {
                    const ficheiros = await ficheirosController.getAllFilesByAlbum(utilizador.utilizadorid, 'UTIL');
                    const fotoUrl = ficheiros[0] ? ficheiros[0].url : '';
    
                    return {
                        ...utilizador,
                        fotoUrl
                    };
                })
            );
    
            const gruposFotos = await Promise.all(
                grupo.map(async grupo => {
                    const ficheiros = await ficheirosController.getAllFilesByAlbum(grupo.grupoid, 'GRUPO');
                    const fotoUrl1 = ficheiros[0] ? ficheiros[0].url : '';
    
                    return {
                        ...grupo,
                        fotoUrl1,
                        utilizadores: utilizadoresComFotos
                    };
                })
            );
    
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: gruposFotos });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao listar todos os grupos públicos', details: error.message });
        }
    }
    
};

module.exports = controladorGrupo;
