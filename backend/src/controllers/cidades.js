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
    
        // Define the extrairCidade function inside getCidadeAPI
        function extrairCidade(concelho) {
            // Exemplo básico: assume que a cidade é o primeiro nome antes de ", "
            const index = concelho.indexOf(', ');
            if (index !== -1) {
                return concelho.substring(0, index);
            } else {
                return concelho; // Se não houver vírgula, retorna o concelho inteiro
            }
        }
    
        try {
            const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=AIzaSyDoHMPXsQ8JvnFfccIVO5zWjSlVp2PA09g`);
            
            const results = response.data.results;
            if (results && results.length > 0) {
                const addressComponents = results[0].address_components;
    
                const concelhoComponent = addressComponents.find(component => 
                    component.types.includes('administrative_area_level_2')
                );
                
                if (concelhoComponent) {
                    const concelho = concelhoComponent.long_name;
                    const cidade = extrairCidade(concelho);
                    res.json({ cidade });
                } else {
                    res.status(404).json({ error: 'Concelho não encontrado na resposta da GeoAPI' });
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