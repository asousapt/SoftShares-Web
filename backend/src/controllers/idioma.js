const { Sequelize, Op } = require('sequelize');
const axios = require('axios');
const initModels = require('../models/init-models');
const sequelizeConn = require('../bdConexao');
const models = initModels(sequelizeConn);

const controladorIdioma = {
    init: async function(){
        try {
            const count = await models.idioma.count();

            if (count < 1){
                await models.idioma.create({
                    descricao: 'Português',
                    icone: 'pt'
                });
                await models.idioma.create({
                    descricao: 'English',
                    icone: 'en'
                });
                await models.idioma.create({
                    descricao: 'Español',
                    icone: 'es'
                });
            }
        } catch (error) {
            console.error('Ocorreu um erro ao criar os idiomas:', error);
        }
    }
}

module.exports = controladorIdioma;