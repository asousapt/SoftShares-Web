const pool = require('./bdConexao'); // Get connection pool

const ParticipantesEventos = {
    criarTabela: function(callback){
        const sqlQuery = `
        CREATE TABLE PARTICIPANTES_EVENTOS (
            PARTICIPANTES_EVENTOSID SERIAL PRIMARY KEY,
            UTILIZADORID INT NOT NULL,
            EVENTOID INT NOT NULL,
            CONVIDADOSADIC INT NOT NULL DEFAULT 0,
            DATACRIACAO TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            DATAALTERACAO TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            CONSTRAINT UK_UTILIZADOR_EVENTO UNIQUE (UTILIZADORID, EVENTOID), 
            CONSTRAINT FK_UTILIZADORES_EVENTOS FOREIGN KEY (UTILIZADORID) REFERENCES UTILIZADOR(UTILIZADORID), 
            CONSTRAINT FK_EVENTOS_PARTICIPANTES FOREIGN KEY (EVENTOID) REFERENCES EVENTO(EVENTOID)
         );
        `
        pool.query(sqlQuery, function(err, results) {
            if (err) {
                console.error('Erro ao criar a tabela PARTICIPANTES_EVENTOS:', err.message);
                callback(err);
            } else {
                callback(null, results);
            }
        });
    },

    adicionar: function(idEvento, idUser, convidados, callback){
        const sqlQuery = `
            INSERT INTO PARTICIPANTES_EVENTOS (EVENTOID, UTILIZADORID, CONVIDADOSADIC) VALUES
            (?, ?, ?)
        `
        const values = [idEvento, idUser, convidados];
        pool.query(sqlQuery, values, function(err, results) {
            if (err) {
                console.error('Erro a inserir participante', err.message);
                callback(err);
            } else {
                callback(null, results);
            }
        });
    },

    update: function(idEvento, idUser, convidados, callback){
        const sqlQuery = `
            UPDATE PARTICIPANTES_EVENTOS
            SET CONVIDADOSADIC = ?
            WHERE EVENTOID = ? AND UTILIZADORID = ?
        `
        const values = [convidados, idEvento, idUser];
        pool.query(sqlQuery, values, function(err, results) {
            if (err) {
                console.error('Erro ao atualizar participante', err.message);
                callback(err);
            } else {
                callback(null, results);
            }
        });
    },

    delete: function(idEvento, idUser, callback){
        const sqlQuery = `
            DELETE FROM PARTICIPANTES_EVENTOS 
            WHERE EVENTOID = ? AND UTILIZADORID = ?
        `
        const values = [idEvento, idUser];
        pool.query(sqlQuery, values, function(err, results) {
            if (err) {
                console.error('Erro ao remover participante', err.message);
                callback(err);
            } else {
                callback(null, results);
            }
        });
    },

    consultarPeloIdEvento: function(idEvento){
        const sqlQuery = `
            SELECT UTILIZADORID, CONVIDADOSADIC 
            FROM PARTICIPANTES_EVENTOS 
            WHERE EVENTOID = ?
        `
        const values = [idEvento];
        pool.query(sqlQuery, values, function(err, results) {
            if (err) {
                console.error('Erro ao consultar participantes do evento', err.message);
                callback(err);
            } else {
                callback(null, results);
            }
        });
    },

    consultarPeloIdUtilizador: function(idEvento){
        const sqlQuery = `
            SELECT EVENTOID, CONVIDADOSADIC 
            FROM PARTICIPANTES_EVENTOS 
            WHERE UTILIZADORID = ?
        `
        const values = [idEvento];
        pool.query(sqlQuery, values, function(err, results) {
            if (err) {
                console.error('Erro ao consultar eventosInscritos', err.message);
                callback(err);
            } else {
                callback(null, results);
            }
        });
    },
}

module.exports = ParticipantesEventos;