const express = require('express');
const router = express.Router();
const controladorPerfil = require('../controllers/perfis');
const { authenticate } = require('../tokenUtils');

// ROUTES GET
router.get('/', authenticate, controladorPerfil.consultarTudo);

module.exports = router;
