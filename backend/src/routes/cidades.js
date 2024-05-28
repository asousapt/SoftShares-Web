const express = require('express');
const router = express.Router();
const cidadesControlador = require('../controllers/cidades');
const { authenticate } = require('../tokenUtils');

//ROUTES GET
router.get('/', authenticate, cidadesControlador.consultarTodos);
router.get('/distritos', authenticate, cidadesControlador.consultarTodosDistritos);
router.get('/distrito/:distritoId', cidadesControlador.consultarCidadesDistrito);

module.exports = router;