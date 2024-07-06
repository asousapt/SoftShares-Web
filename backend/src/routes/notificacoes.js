const express = require('express');
const router = express.Router();
const controladorNotificacoes = require('../controllers/notificacoes');
const { authenticate } = require('../tokenUtils');

//ROUTES POST
router.post('/', authenticate, controladorNotificacoes.adicionar);

//ROUTES PUT
router.put('/lida/:id', authenticate, controladorNotificacoes.marcarLida);

//ROUTES DELETE
router.delete('/:id', authenticate, controladorNotificacoes.remover);

//ROUTES GET
router.get('/utilizador/:idUser', authenticate, controladorNotificacoes.consultarPorUtilizador);
router.get('/utilizador/:idUser/naolidas', authenticate, controladorNotificacoes.consultarPorUtilizadorActivas);

module.exports = router;
