const { Sequelize, Op, where } = require('sequelize');
const initModels = require('../models/init-models');
const sequelizeConn = require('../bdConexao');
const objStorage = require('../minio');
const models = initModels(sequelizeConn);

const controladorFicheiros = {
    adicionar: async (id, entidade, files, userID) => {
        try {
            const objecto = await models.objecto.findOne({
                where:{
                    registoid: id,
                    entidade: entidade
                }
            });
            if (!objecto){
                console.error('O objeto não existe!');
                return false;
            }

            let album = await models.album.findOne({
                where:{
                    objectoid: objecto.objectoid
                }
            });
            if (!album){
                album = await models.album.create({
                    objectoid: objecto.objectoid,
                    utilizadorid: userID,
                    descricao: `${entidade}_${id}`
                });
            }

            for (const file of files){
                await models.ficheiro.create({
                    albumid: album.albumid,
                    caminho: file.caminho,
                    nome: file.nome,
                    extensao: file.nome.split('.')[1],
                    tamanho: file.tamanho
                });

                objStorage.insertFile(album.descricao, file.base64, file.nome);
            }
            return true;
        } catch (error) {
            console.error('Não foi possível adicionar os ficheiros!', error);
            return false;
        }
    } 
}

module.exports = controladorFicheiros