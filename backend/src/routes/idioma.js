const express = require('express');
const router = express.Router();
const idiomaControlador = require('../controllers/idioma');

//ROUTES GET
router.get('/', idiomaControlador.consultarIdiomas);

module.exports = router;