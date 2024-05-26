const { Sequelize, Op } = require('sequelize');
const axios = require('axios');
const initModels = require('../models/init-models');
const sequelizeConn = require('../bdConexao');
const models = initModels(sequelizeConn);

const controladorPerfil = {
    init: async function(){
        try {
            const count = await models.perfil.count();

            if (count < 1){
                await models.perfil.create({
                    descricao: 'Super Admin',
                    configsistema: 1,
                    moderaconteudo: 0,
                    utilnormal: 0
                });
                await models.perfil.create({
                    descricao: 'Admin',
                    configsistema: 0,
                    moderaconteudo: 1,
                    utilnormal: 0
                });
                await models.perfil.create({
                    descricao: 'User',
                    configsistema: 0,
                    moderaconteudo: 0,
                    utilnormal: 1
                });
            }
        } catch (error) {
            console.error('Ocorreu um erro ao criar os Utilizadores', error);
        }
    },

    consultarTudo: async (req, res) => {
        try {
            const perfil = await models.perfil.findAll();
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: perfil });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar perfil', details: error.message });
        }
    },
}


module.exports = controladorPerfil;