const express = require('express');
const router = express.Router();
const sessaoController = require('../controllers/sessao');
const { authenticate } = require('../tokenUtils');

// Rotas POST
router.post('/add', authenticate, sessaoController.adicionar);

// Rotas PUT
router.put('/update/:idSessao', authenticate, sessaoController.atualizar);

// Rotas DELETE
router.delete('/delete/:idSessao', authenticate, sessaoController.remover);

// Rotas GET
router.get('/', authenticate, sessaoController.consultarTudo);
router.get('/utilizador/:idUtilizador', authenticate, sessaoController.consultarPorUtilizador);

module.exports = router;
