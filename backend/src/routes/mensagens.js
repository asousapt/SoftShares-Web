const express = require('express');
const router = express.Router();
const controladorMensagens = require('../controllers/mensagem');
const { authenticate } = require('../tokenUtils');

//ROUTES POST
router.post('/', authenticate, controladorMensagens.adicionar);

//ROUTES PUT

//ROUTES DELETE
router.delete('/:id', authenticate, controladorMensagens.remover);

//ROUTES GET
router.get('/all/:idDestinatario/:tipoDestinatario', authenticate, controladorMensagens.consultarTudo);


module.exports = router;
