const { Sequelize, Op, QueryTypes } = require('sequelize');
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
    },
    consultarIdiomas: async (req, res) => {
        try {
            const idiomas = await sequelizeConn.query(
                `select 
                    idiomaid, 
                    descricao, 
                    icone
                from idioma
                order by idiomaid asc`,
                { type: QueryTypes.SELECT }
            );
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: idiomas });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao obter idiomas', details: error.message });
        }
    },
}

module.exports = controladorIdioma;
