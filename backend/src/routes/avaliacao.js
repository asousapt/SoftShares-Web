const express = require('express');
const router = express.Router();
const avaliacaoController = require('../controllers/avaliacao');
const { authenticate } = require('../tokenUtils');

// Rotas POST
router.post('/add', authenticate, avaliacaoController.adicionar);

// Rotas PUT
router.put('/update/:idAvaliacao', authenticate, avaliacaoController.atualizar);

// Rotas DELETE
router.delete('/delete/:idAvaliacao', authenticate, avaliacaoController.remover);

// Rotas GET
router.get('/', authenticate, avaliacaoController.consultarTudo);
router.get('/item/:itemAvaliacaoId', authenticate, avaliacaoController.consultarPorItem);

module.exports = router;
