const { Sequelize, QueryTypes, json } = require('sequelize');
const initModels = require('../models/init-models');
const sequelizeConn = require('../bdConexao');
const models = initModels(sequelizeConn);
const { generateToken } = require('../tokenUtils');
const ficheirosController = require('./ficheiros');
const subcategoria_fav_util = require('../models/subcategoria_fav_util');
const utilizador = require('../models/utilizador');

const controladorUtilizadores = {
    adicionar: async (req, res) => {
        console.log(req.body);
        const {
            poloid,
            perfilid,
            pnome,
            unome,
            email,
            passwd,
            chavesalt,
            idiomaid,
            departamentoid,
            funcaoid,
            sobre,
            inactivo,
            imagem,
            administrador_poloid
        } = req.body;
        
        try {
            const user = await models.utilizador.create({
                poloid,
                perfilid,
                pnome,
                unome,
                email,
                passwd,
                chavesalt,
                idiomaid,
                departamentoid,
                funcaoid,
                sobre,
                inactivo
            });
            
            await models.destinatario.create({
                itemdestinatario: user.utilizadorid,
                tipo: 'UT'
            });

            await models.objecto.create({
                registoid: user.utilizadorid,
                entidade: 'UTIL'
            });

            if (administrador_poloid) {
                await models.administrador_polo.create({
                    utilizadorid: user.utilizadorid,
                    poloid: administrador_poloid
                });
            }

            ficheirosController.adicionar(user.utilizadorid, 'UTIL', imagem, user.utilizadorid);

            res.status(201).json({ message: 'Utilizador adicionado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao adicionar utilizador', details: error });
        }
    },

    atualizar: async (req, res) => {
        const { idUtilizador } = req.params;
        const {
            poloid,
            perfilid,
            pnome,
            unome,
            email,
            passwd,
            chavesalt,
            idiomaid,
            departamentoid,
            funcaoid,
            sobre,
            imagem,
            administrador_poloid
        } = req.body;

        try {
            await models.utilizador.update({
                poloid,
                perfilid,
                pnome,
                unome,
                email,
                passwd,
                chavesalt,
                idiomaid,
                departamentoid,
                funcaoid,
                sobre
            }, {
                where: {
                    utilizadorid: idUtilizador
                }
            });

            ficheirosController.removerTodosFicheirosAlbum(idUtilizador, 'UTIL');
            ficheirosController.adicionar(idUtilizador, 'UTIL', imagem, idUtilizador);
            
            const existeAdminPolo = await models.administrador_polo.findOne({
                where: { utilizadorid: idUtilizador }
            });
    
            if (administrador_poloid) {
                if (existeAdminPolo) {
                    await models.administrador_polo.update({
                        poloid: administrador_poloid
                    }, {
                        where: { utilizadorid: idUtilizador }
                    });
                } else {
                    await models.administrador_polo.create({
                        utilizadorid: idUtilizador,
                        poloid: administrador_poloid
                    });
                }
            } else {
                if (existeAdminPolo) {
                    await models.administrador_polo.destroy({
                        where: { utilizadorid: idUtilizador }
                    });
                }
            }

            res.status(200).json({ message: 'Utilizador atualizado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar utilizador', details: error.message });
        }
    },

    atualizarMobile: async (req, res) => {
        console.log(req.body);
        const { idUtilizador } = req.params;
        const {
            poloid,
            pnome,
            unome,
            email,
            idiomaid,
            departamentoid,
            funcaoid,
            sobre,
            imagem,
            preferencias,
        } = req.body;
    
        try {
            // Cria dinamicamente um objeto com os campos a atualizar
            const updateData = {};
            if (poloid !== undefined) updateData.poloid = poloid;
            if (pnome !== undefined) updateData.pnome = pnome;
            if (unome !== undefined) updateData.unome = unome;
            if (email !== undefined) updateData.email = email;
            if (idiomaid !== undefined) updateData.idiomaid = idiomaid;
            if (departamentoid !== undefined) updateData.departamentoid = departamentoid;
            if (funcaoid !== undefined) updateData.funcaoid = funcaoid;
            if (sobre !== undefined) updateData.sobre = sobre;
    
            // Actualiza a tabela utilizadorcom os campos fornecidos
            await models.utilizador.update(updateData, {
                where: {
                    utilizadorid: idUtilizador
                }
            });
    
            // atualiza a imagem do utilizador
            if (imagem) {
                const imageArray =  JSON.parse(imagem);
                ficheirosController.removerTodosFicheirosAlbum(idUtilizador, 'UTIL');
                ficheirosController.adicionar(idUtilizador, 'UTIL', imageArray, idUtilizador);
            }
    
            // atualiza as preferencias do utilizador
            if (preferencias) {
                //remove as subcategorias favoritas anteriores
                await models.subcategoria_fav_util.destroy({
                    where: { utilizadorid: idUtilizador }
                });
    
                // adiciona as novas subcategorias favoritas
                for (const subcategoriaid of preferencias) {
                    await models.subcategoria_fav_util.create({
                        utilizadorid: idUtilizador,
                        subcategoriaid
                    });
                }
            }

    
            res.status(200).json({message: 'Utilizador atualizado com sucesso', data: idUtilizador});
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar utilizador', details: error.message });
        }
    },
    
    remover: async (req, res) => {
        const { idUtilizador } = req.params;

        try {
            await models.objecto.destroy({
                where: {
                    registoid: idUtilizador,
                    entidade: 'USER'
                }
            });

            await models.destinatario.destroy({
                where: {
                    itemdestinatario: idUtilizador,
                    tipo: 'UT'
                }
            });

            await models.utilizador.destroy({
                where: {
                    utilizadorid: idUtilizador
                }
            });

            res.status(200).json({ message: 'Utilizador removido com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao remover utilizador', details: error.message });
        }
    },

    consultarPorID: async (req, res) => {
        const { idUtilizador } = req.params;

        try {
            const utilizador = await models.utilizador.findByPk(idUtilizador, {
                include: [
                    {
                        model: models.perfil,
                        as: 'perfil',
                        attributes: ['descricao']
                    },
                    {
                        model: models.administrador_polo,
                        as: 'administrador_polos',
                        include: {
                            model: models.polo,
                            as: 'polo'
                        }
                    }
                ]
            });

            if (!utilizador) {
                return res.status(404).json({ error: 'Utilizador não encontrado' });
            }

            const ficheiros = await ficheirosController.getAllFilesByAlbum(utilizador.utilizadorid, 'UTIL');
            utilizador.dataValues.imagem = ficheiros[0];

            res.status(200).json({ message: 'Consulta realizada com sucesso', data: utilizador });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar utilizador', details: error.message });
        }
    },

    consultarPorIDMobile: async (req, res) => {
        const { idUtilizador } = req.params;
    
        try {
            const utilizador = await models.utilizador.findByPk(idUtilizador, {
                attributes: ['utilizadorid', 'pnome', 'unome', 'email', 'sobre', 'poloid', 'departamentoid', 'funcaoid', 'idiomaid'],
                include: [
                    {
                        model: models.subcategoria_fav_util,
                        as: 'subcategoria_fav_utils',
                        attributes: ['subcategoriaid']  
                    }
                ]
            });
    
            if (!utilizador) {
                return res.status(404).json({ error: 'Utilizador não encontrado' });
            }
    
            // Faz o mapp das subcategorias favoritas para um array de ids
            const preferencias = utilizador.subcategoria_fav_utils.map(sub => sub.subcategoriaid    );

            const ficheiros = await ficheirosController.getAllFilesByAlbum(utilizador.utilizadorid, 'UTIL');
            const fotoUrl = ficheiros[0] ? ficheiros[0].url : '';
            // adiciona a propriedade fotoUrl ao objeto utilizador
            utilizador.dataValues.fotoUrl = fotoUrl;
            // adiciona o objecto da imagem completo ao objeto utilizador
            utilizador.dataValues.imagem = ficheiros[0];
    
            // adiciona as preferencias ao objeto utilizador
            utilizador.dataValues.preferencias = preferencias;
    
            // remove a propriedade subcategoria_fav_utils do objeto utilizador original
            delete utilizador.dataValues.subcategoria_fav_utils;
    
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: utilizador });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar utilizador', details: error.message });
        }
    },
    
    consultarPorEmail: async (req, res) => {
        const { email } = req.params;

        try {
            const utilizador = await models.utilizador.findOne({
                where: {
                    email: email
                },
                include: [
                    {
                        model: models.perfil,
                        as: 'perfil'
                    },
                    {
                        model: models.administrador_polo,
                        as: 'administrador_polos',
                        include: [{ model: models.polo, as: 'polo' }]
                    }]
            });

            if (!utilizador) {
                return res.status(404).json({ error: 'Utilizador não encontrado' });
            }
            
            const ficheiros = await ficheirosController.getAllFilesByAlbum(utilizador.utilizadorid, 'UTIL');
            utilizador.dataValues.imagem = ficheiros[0];
            console.log(utilizador);
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: utilizador });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar utilizador', details: error.message });
        }
    },

    consultarTodos: async (req, res) => {
        try {
            const utilizadors = await sequelizeConn.query(
                `SELECT 
                    u.*, 
                    perf.descricao AS descricao_perfil,
                    pol.descricao AS descricao_polo,
                    dep.valor AS descricao_departamento,
                    func.valor AS descricao_funcao
                FROM 
                    utilizador u
                LEFT JOIN 
                    perfil perf ON u.perfilid = perf.perfilid
                LEFT JOIN 
                    polo pol ON u.poloid = pol.poloid
                INNER JOIN 
                    chave ch_dep ON u.departamentoid = ch_dep.registoid AND ch_dep.entidade = 'DEPARTAMENTO'
                LEFT JOIN 
                    traducao dep ON ch_dep.chaveid = dep.chaveid AND dep.idiomaid = 1
                INNER JOIN 
                    chave ch_func ON u.funcaoid = ch_func.registoid AND ch_func.entidade = 'FUNCAO'
                LEFT JOIN 
                    traducao func ON ch_func.chaveid = func.chaveid AND func.idiomaid = 1`,
                { type: QueryTypes.SELECT }
            );
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: utilizadors });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar utilizadores', details: error.message });
        }
    },

    consultarTotalPorPolo: async (req, res) => {
        try {
            const totalPorPolo = await sequelizeConn.query(
                `SELECT 
                    pol.descricao AS label, 
                    COUNT(u.utilizadorid) AS value
                FROM 
                    utilizador u
                LEFT JOIN 
                    polo pol ON u.poloid = pol.poloid
                GROUP BY 
                    pol.descricao`,
                { type: QueryTypes.SELECT }
            );

            res.status(200).json({ message: 'Consulta realizada com sucesso', data: totalPorPolo });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar utilizadores por polo', details: error.message });
        }
    },

    consultarTodosComFiltro: async (req, res) => {
        const { estado, descricao, poloid } = req.query;
        try {
            let whereClause = '';
            if (estado !== undefined) {
                whereClause += ` AND u.inactivo = ${estado}`;
            }

            if (poloid) {
                whereClause += `AND u.poloid = ${poloid}`;
            }

            const utilizadors = await sequelizeConn.query(
                `SELECT 
                    u.*, 
                    perf.descricao AS descricao_perfil,
                    pol.descricao AS descricao_polo,
                    dep.valor AS descricao_departamento,
                    func.valor AS descricao_funcao
                FROM 
                    utilizador u
                LEFT JOIN 
                    perfil perf ON u.perfilid = perf.perfilid
                LEFT JOIN 
                    polo pol ON u.poloid = pol.poloid
                INNER JOIN 
                    chave ch_dep ON u.departamentoid = ch_dep.registoid AND ch_dep.entidade = 'DEPARTAMENTO'
                LEFT JOIN 
                    traducao dep ON ch_dep.chaveid = dep.chaveid AND dep.idiomaid = 1
                INNER JOIN 
                    chave ch_func ON u.funcaoid = ch_func.registoid AND ch_func.entidade = 'FUNCAO'
                LEFT JOIN 
                    traducao func ON ch_func.chaveid = func.chaveid AND func.idiomaid = 1
                WHERE
                    CONCAT(u.pnome, ' ', u.unome) LIKE '%${descricao}%'
                ${whereClause}
                    `,
                { type: QueryTypes.SELECT }
            );
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: utilizadors });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar utilizadores', details: error.message });
        }
    },

    novoToken: async (req, res) => {
        const { id } = req.params;
        try {
            const utilizador = await models.utilizador.findByPk(id);

            const token = generateToken(utilizador);
            res.status(200).json(token);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar utilizadores', details: error.message });
        }
    },
};

module.exports = controladorUtilizadores;