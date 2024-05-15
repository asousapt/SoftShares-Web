const Evento = require('../models/eventos');

const controladorEventos = {
    // criarTabela: (req, res) => {
    //     Evento.criarTabela((err, results) => {
    //         if (err) {
    //             res.status(500).json({ error: 'Erro ao criar a tabela EVENTO' });
    //         } else {
    //             res.status(200).json({ message: 'Tabela EVENTO criada com sucesso' });
    //         }
    //     });
    // },

    adicionarEvento: (req, res) => {
        const { titulo, descricao, dataInicio, dataFim, dataLimInscricao, nmrMaxParticipantes, localizacao, latitude, longitude, cidadeID, utilizadorCriou } = req.body;
        Evento.adicionar(titulo, descricao, dataInicio, dataFim, dataLimInscricao, nmrMaxParticipantes, localizacao, latitude, longitude, cidadeID, utilizadorCriou, (err, results) => {
            if (err) {
                res.status(500).json({ error: 'Erro ao adicionar evento' });
            } else {
                res.status(200).json({ message: 'Evento adicionado com sucesso' });
            }
        });
    },

    atualizarEvento: (req, res) => {
        const { idEvento } = req.params;
        const { titulo, descricao, dataInicio, dataFim, dataLimInscricao, nmrMaxParticipantes, localizacao, latitude, longitude, cidadeID } = req.body;
        Evento.atualizar(idEvento, titulo, descricao, dataInicio, dataFim, dataLimInscricao, nmrMaxParticipantes, localizacao, latitude, longitude, cidadeID, (err, results) => {
            if (err) {
                res.status(500).json({ error: 'Erro ao atualizar evento' });
            } else {
                res.status(200).json({ message: 'Evento atualizado com sucesso' });
            }
        });
    },

    aprovarEvento: (req, res) => {
        const { idEvento, idUser } = req.params;
        Evento.aprovar(idEvento, idUser, (err, results) => {
            if (err) {
                res.status(500).json({ error: 'Erro ao aprovar o evento' });
            } else {
                res.status(200).json({ message: 'Evento aprovado com sucesso' });
            }
        });
    },

    cancelarEvento: (req, res) => {
        const { idEvento } = req.params;
        Evento.cancelar(idEvento, (err, results) => {
            if (err) {
                res.status(500).json({ error: 'Erro ao cancelar o evento' });
            } else {
                res.status(200).json({ message: 'Evento cancelado com sucesso' });
            }
        });
    },

    consultarEventoPorID: (req, res) => {
        const { idEvento } = req.params;
        Evento.consultarPorID(idEvento, (err, results) => {
            if (err) {
                res.status(500).json({ error: 'Erro ao consultar o evento' });
            } else {
                res.status(200).json({ message: 'Consulta realizada com sucesso', data: results });
            }
        });
    },

    consultarEventosEntreDatas: (req, res) => {
        const { poloID, data1, data2 } = req.params;
        Evento.consultaEntreDatas(data1, data2, poloID, (err, results) => {
            if (err) {
                res.status(500).json({ error: 'Erro ao consultar os eventos' });
            } else {
                res.status(200).json({ message: 'Consulta realizada com sucesso', data: results });
            }
        });
    }
};

module.exports = controladorEventos;