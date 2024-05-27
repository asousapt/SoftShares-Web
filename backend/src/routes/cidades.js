const express = require('express');
const router = express.Router();
const cidadesControlador = require('../controllers/cidades');
const { authenticate } = require('../tokenUtils');

//ROUTES GET
router.get('/', authenticate, cidadesControlador.consultarTodos);

module.exports = router;