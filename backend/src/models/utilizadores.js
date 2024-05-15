const pool = require('./bdConexao'); // Get connection pool

const Utilizador = {
    criarTabela: function(callback){
        const sqlQuery = `
            CREATE TABLE IF NOT EXISTS UTILIZADOR (
                UTILIZADORID SERIAL PRIMARY KEY,
                POLOID INT NOT NULL,
                PERFILID INT NOT NULL,
                PNOME VARCHAR(60) NOT NULL,
                UNOME VARCHAR(60) NOT NULL,
                EMAIL VARCHAR(60) NOT NULL UNIQUE,
                PASSWD VARCHAR(60) NOT NULL,
                CHAVESALT VARCHAR(60) NOT NULL,
                IDIOMAID INT NOT NULL,
                DEPARTAMENTOID INT,
                FUNCAOID INT,
                SOBRE VARCHAR(60) NOT NULL DEFAULT '',
                INACTIVO BOOLEAN NOT NULL DEFAULT FALSE,
                DATAINACTIVACAO TIMESTAMP NULL,
                DATACRIACAO TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                DATAALTERACAO TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                CONSTRAINT FK_POLO_UTILIZADOR FOREIGN KEY (POLOID) REFERENCES POLO(POLOID),
                CONSTRAINT FK_PERFIL_UTILIZADOR FOREIGN KEY (PERFILID) REFERENCES PERFIL(PERFILID),
                CONSTRAINT FK_IDIOMA_UTILIZADOR FOREIGN KEY (IDIOMAID) REFERENCES IDIOMA(IDIOMAID),
                CONSTRAINT FK_UTILIZADOR_DEPARTAMENTO FOREIGN KEY (DEPARTAMENTOID) REFERENCES DEPARTAMENTO(DEPARTAMENTOID),
                CONSTRAINT FK_UTILIZADOR_FUNCAO FOREIGN KEY (FUNCAOID) REFERENCES FUNCAO(FUNCAOID)
            );
        `
        pool.query(sqlQuery, function(err, results) {
            if (err) {
                console.error('Erro ao criar a tabela UTILIZADOR:', err.message);
                callback(err);
            } else {
                callback(null, results);
            }
        });
    },
}

module.exports = Utilizador;