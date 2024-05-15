const pool = require('./bdConexao'); // Get connection pool

const Evento = {
    criarTabela: function(callback){
        const sqlQuery = `
            CREATE TABLE IF NOT EXISTS EVENTO (
                EVENTOID SERIAL PRIMARY KEY,
                TITULO VARCHAR(160) NOT NULL,
                DESCRICAO TEXT NOT NULL,
                DATAINICIO TIMESTAMP NOT NULL,
                DATAFIM TIMESTAMP NOT NULL,
                DATALIMINSCRICAO TIMESTAMP NOT NULL,
                CANCELADO BOOLEAN DEFAULT FALSE,
                NMRMAXPARTICIPANTES INT NOT NULL,
                LOCALIZACAO VARCHAR(160) NOT NULL,
                LATITUDE VARCHAR(20) NOT NULL,
                LONGITUDE VARCHAR(20) NOT NULL,
                CIDADEID INT NOT NULL,
                DATACRIACAO TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                DATAALTERACAO TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                UTILIZADORCRIOU INT NOT NULL,
                UTILIZADORAPROVOU INT,
                APROVADO BOOLEAN DEFAULT FALSE, 
                DATAAPROVACAO TIMESTAMP,
                CONSTRAINT FK_UTILIZADOR_CRIOU_EVENTO FOREIGN KEY (UTILIZADORCRIOU) REFERENCES UTILIZADOR(UTILIZADORID),
                CONSTRAINT FK_UTILIZADOR_APROVOU_EVENTO FOREIGN KEY (UTILIZADORAPROVOU) REFERENCES UTILIZADOR(UTILIZADORID), 
                CONSTRAINT FK_CIDADE_EVENTO FOREIGN KEY (CIDADEID) REFERENCES CIDADE(CIDADEID)
            );
        `
        pool.query(sqlQuery, function(err, results) {
            if (err) {
                console.error('Erro ao criar a tabela EVENTO:', err.message);
                callback(err);
            } else {
                callback(null, results);
            }
        });
    },

    adicionar: function(titulo, descricao, dataInicio, dataFim, dataLimInscricao, nmrMaxParticipantes, localizacao, latitude, longitude, cidadeID, utilizadorCriou, callback){
        const sqlQuery = `
            INSERT INTO EVENTO (TITULO, DESCRICAO, DATAINICIO, DATAFIM, DATALIMINSCRICAO, NMRMAXPARTICIPANTES, LOCALIZACAO, LATITUDE, LONGITUDE, CIDADEID, UTILIZADORCRIOU) VALUES
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `
        const values = [titulo, descricao, dataInicio, dataFim, dataLimInscricao, nmrMaxParticipantes, localizacao, latitude, longitude, cidadeID, utilizadorCriou];
        pool.query(sqlQuery, values, function(err, results) {
            if (err) {
                console.error('Erro a inserir evento', err.message);
                callback(err);
            } else {
                callback(null, results);
            }
        });
    },

    atualizar: function(eventoID, titulo, descricao, dataInicio, dataFim, dataLimInscricao, nmrMaxParticipantes, localizacao, latitude, longitude, cidadeID, callback){
        const sqlQuery = `
            UPDATE EVENTO 
            SET TITULO = ?, DESCRICAO = ?, DATAINICIO = ?, DATAFIM = ?, DATALIMINSCRICAO = ?, NMRMAXPARTICIPANTES = ?, LOCALIZACAO = ?, LATITUDE = ?, LONGITUDE = ?, CIDADEID = ?
            WHERE EVENTOID = ?
        `
        const values = [titulo, descricao, dataInicio, dataFim, dataLimInscricao, nmrMaxParticipantes, localizacao, latitude, longitude, cidadeID, eventoID];
        pool.query(sqlQuery, values, function(err, results) {
            if (err) {
                console.error('Erro a inserir evento', err.message);
                callback(err);
            } else {
                callback(null, results);
            }
        });
    },

    aprovar: function(idEvento, idUser, callback){
        const sqlQuery = `
            UPDATE EVENTO 
            SET APROVADO = 1, UTILIZADORAPROVOU = ?, DATAAPROVACAO = SYSDATE() 
            WHERE EVENTOID = ?
        `
        pool.query(sqlQuery, [idUser, idEvento], function(err, results) {
            if (err) {
                console.error('Erro ao aprovar o evento', err.message);
                callback(err);
            } else {
                callback(null, results);
            }
        });
    },

    cancelar: function(idEvento, callback){
        const sqlQuery = `
            UPDATE EVENTO 
            SET CANCELADO = 1
            WHERE EVENTOID = ?
        `
        pool.query(sqlQuery, [idEvento], function(err, results) {
            if (err) {
                console.error('Erro ao cancelar o evento', err.message);
                callback(err);
            } else {
                callback(null, results);
            }
        });
    },

    consultarPorID: function(idEvento, callback){
        const sqlQuery = `
            SELECT * FROM EVENTO 
            WHERE EVENTOID = ?
        `
        pool.query(sqlQuery, [idEvento], function(err, results) {
            if (err) {
                console.error('Erro ao consultar a tabela evento', err.message);
                callback(err);
            } else {
                callback(null, results);
            }
        });
    },

    consultaEntreDatas: function(dataInicio, dataFim, poloID, callback){
        const sqlQuery = `
            SELECT * FROM EVENTO 
            WHERE DATAINICIO BETWEEN ? AND ? AND CIDADEID = (SELECT CIDADEID FROM POLO WHERE POLOID = ?)
        `
        pool.query(sqlQuery, [dataInicio, dataFim, poloID], function(err, results) {
            if (err) {
                console.error('Erro ao consultar a tabela evento', err.message);
                callback(err);
            } else {
                callback(null, results);
            }
        });
    },
}

module.exports = Evento;