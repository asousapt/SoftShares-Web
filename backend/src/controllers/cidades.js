const { Sequelize, Op } = require('sequelize');
const initModels = require('../models/init-models');
const sequelizeConn = require('../bdConexao');
const models = initModels(sequelizeConn);
const axios = require('axios');

const controladorCidades = {
    consultarTodos: async (req, res) => {
        try {
            const cidade = await models.cidade.findAll();
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: cidade });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar utilizador', details: error.message });
        }
    },

    consultarTodosDistritos: async (req, res) => {
        try {
            const distrito = await models.distrito.findAll();
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: distrito });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar utilizador', details: error.message });
        }
    },

    consultarCidadesDistrito: async (req, res) => {
        try {
            const { distritoId } = req.params;
            const cidades = await models.cidade.findAll({
                where: { distritoid: distritoId }
            });
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: cidades });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar cidades por distrito', details: error.message });
        }
    },

    consultarDistritoCidade: async (req, res) => {
        try {
            const { cidadeId } = req.params;
            const cidade = await models.cidade.findOne({
                where: { cidadeid: cidadeId },
                include: [{ model: models.distrito, as: 'distrito' }]
            });

            if (!cidade) {
                return res.status(404).json({ message: 'Cidade não encontrada' });
            }

            res.status(200).json({ message: 'Consulta realizada com sucesso', data: cidade.distrito });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar distrito por cidade', details: error.message });
        }
    },

    

    getCidadeAPI: async (req, res) => {
        const { lat, lon } = req.params;
        
        const normalizeName = (name) => {
            // Remove "District", "Distrito de", e espaços extras
            return name.replace(/District|Distrito de/gi, '').trim();
        };

        try {
            const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&language=pt&key=AIzaSyDoHMPXsQ8JvnFfccIVO5zWjSlVp2PA09g`);
            
            const results = response.data.results;
            if (results && results.length > 0) {
                const addressComponents = results[0].address_components;
    
                const distritoComponent = addressComponents.find(component => 
                    component.types.includes('administrative_area_level_1')
                );
    
                const cidadeComponent = addressComponents.find(component => 
                    component.types.includes('administrative_area_level_2')
                );
    
                const concelhoComponent = addressComponents.find(component => 
                    component.types.includes('administrative_area_level_3')
                );
    
                if (distritoComponent && cidadeComponent && concelhoComponent) {
                    const distrito = normalizeName(distritoComponent.long_name);
                    const cidade = normalizeName(cidadeComponent.long_name);
                    const concelho = normalizeName(concelhoComponent.long_name);
    
                    res.json({ distrito, cidade, concelho });
                } else {
                    res.status(404).json({ error: 'Informações necessárias não encontradas na resposta da GeoAPI' });
                }
            } else {
                res.status(404).json({ error: 'Nenhum resultado encontrado para as coordenadas fornecidas' });
            }
        } catch (error) {
            console.error('Erro ao obter dados da GeoAPI:', error);
            res.status(500).json({ error: 'Falha ao obter dados da GeoAPI' });
        }
    },

};

module.exports = controladorCidades;