const express = require('express');
const router = express.Router();
const suporteController = require('../controllers/suporte');
const { authenticate } = require('../tokenUtils');

router.post('/enviar', authenticate, suporteController.enviarEmailSuporte);

module.exports = router;