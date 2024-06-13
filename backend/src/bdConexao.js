require('dotenv').config();
const { Sequelize } = require('sequelize');

function getConfig(env) {
    return {
        host: process.env[`${env}_PGHOST`],
        port: process.env[`${env}_PGPORT`],
        username: process.env[`${env}_PGUSER`],
        password: process.env[`${env}_PGPASSWORD`],
        database: process.env[`${env}_PGDATABASE`],
        dialect: 'postgres',
        pool: {
            max: parseInt(process.env[`${env}_PGCONNECTIONLIMIT`], 10) || 10,
            min: 0,
            acquire: 30000,
            idle: 100000000
        },
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: true
            }
        }
    };
}

const env = process.env.NODE_ENV === 'production' ? 'PROD' : 'DEV';
const config = getConfig(env);

const sequelize = new Sequelize(config.database, config.username, config.password, config);

module.exports = sequelize;
