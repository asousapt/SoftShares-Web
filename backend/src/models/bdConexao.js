require('dotenv').config();
const { Pool } = require('pg');

function getConfig(env) {
    return {
      host: process.env[`${env}_PGHOST`],
      port: process.env[`${env}_PGPORT`],
      user: process.env[`${env}_PGUSER`],
      password: process.env[`${env}_PGPASSWORD`],
      database: process.env[`${env}_PGDATABASE`],
      max: process.env[`${env}_PGCONNECTIONLIMIT`] || 10,
      ssl: {
          rejectUnauthorized: true
      },
      sslmode: 'require'
    };
}

const env = process.env.NODE_ENV === 'production' ? 'PROD' : 'DEV';

const poolPostgres = new Pool(getConfig(env));

module.exports = poolPostgres;