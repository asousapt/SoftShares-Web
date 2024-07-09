const { Sequelize, Op } = require('sequelize');
const axios = require('axios');
const initModels = require('../models/init-models');
const sequelizeConn = require('../bdConexao');
const models = initModels(sequelizeConn);

const controladorDistritos = {
    init: async function(){
        try {
          const count = await models.distrito.count();

          if (count < 1){
            const response = await axios.get('https://json.geoapi.pt/distritos/municipios');
            const distritos = response.data;

            for (let index in distritos) {
              const distrito = await models.distrito.create({
                nome: distritos[index].distrito
              });
              
              const cidades = distritos[index].municipios
              for (let indexCidades in cidades){
                await models.cidade.create({
                  distritoid: distrito.distritoid,
                  nome: cidades[indexCidades].nome
                });
              }
            }
          }
        } catch (error) {
          console.error('There was an error making the GET request:', error);
        }
    }
}

module.exports = controladorDistritos;