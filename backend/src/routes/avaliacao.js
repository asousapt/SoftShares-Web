const express = require('express');
const router = express.Router();
const avaliacaoController = require('../controllers/avaliacao');
const { authenticate } = require('../tokenUtils');

// Rotas POST
router.post('/add', authenticate, avaliacaoController.adicionar);
router.post('/add/itemavaliacao', authenticate, avaliacaoController.adicionarItemAvaliacao);

// Rotas PUT
router.put('/update/:tipo/:idRegisto', authenticate, avaliacaoController.atualizar);
router.put('/update/itemavaliacao/:id', authenticate, avaliacaoController.atualizarItemAvaliacao);

// Rotas DELETE
router.delete('/delete/:idAvaliacao', authenticate, avaliacaoController.remover);
router.delete('/delete/itemavaliacao/:id', authenticate, avaliacaoController.removerItemAvaliacao);

// Rotas GET
router.get('/', authenticate, avaliacaoController.consultarTudo);
router.get('/item/:itemAvaliacaoId', authenticate, avaliacaoController.consultarAvalicao);
router.get('/tipoentidade', authenticate, avaliacaoController.consultarTodosItemAvalicao);
router.get('/tipoentidade/:tipoentidade', authenticate, avaliacaoController.consultarItemAvaliacao);
router.get('/poi/:idPonto/utilizador/:idUser', authenticate, avaliacaoController.consultarPorPOIeUtilizador);

module.exports = router;
