const { Sequelize } = require('sequelize');
const initModels = require('../models/init-models');
const sequelizeConn = require('../bdConexao');
const models = initModels(sequelizeConn);

const departamentoController = {
    adicionarDepartamento: async (req, res) => {
        try {
            await models.departamento.create({
              
            });

            res.status(201).json({ message: 'Departamento adicionado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao adicionar departamento', details: error.message });
        }
    },

    atualizarDepartamento: async (req, res) => {
        const { idDepartamento } = req.params;

        try {
            await models.departamento.update({
                
            }, {
                where: {
                    departamentoid: idDepartamento
                }
            });

            res.status(200).json({ message: 'Departamento atualizado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar departamento' });
        }
    },

    excluirDepartamento: async (req, res) => {
        const { idDepartamento } = req.params;

        try {
            await models.departamento.destroy({
                where: {
                    departamentoid: idDepartamento
                }
            });

            res.status(200).json({ message: 'Departamento excluído com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao excluir departamento' });
        }
    },

    consultarDepartamentoPorID: async (req, res) => {
        const { idDepartamento } = req.params;

        try {
            const departamento = await models.departamento.findByPk(idDepartamento);
            res.status(200).json({ message: 'Consulta realizada com sucesso', data: departamento });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar o departamento' });
        }
    }
};

module.exports = departamentoController;
