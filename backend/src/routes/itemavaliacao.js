const express = require('express');
const router = express.Router();
const controladorItemAvaliacao = require('../controllers/itemavaliacao');
const { authenticate } = require('../tokenUtils'); // Ajuste o caminho conforme necessário

// POST - Adicionar um novo item de avaliação
router.post('/add', authenticate, controladorItemAvaliacao.adicionar);

// PUT - Atualizar um item de avaliação existente
router.put('/update/:id', authenticate, controladorItemAvaliacao.atualizar);

// DELETE - Remover um item de avaliação
router.delete('/delete/:id', authenticate, controladorItemAvaliacao.remover);

// GET - Consultar itens de avaliação por tipo de entidade
router.get('/tipoentidade/:tipoentidade', authenticate, controladorItemAvaliacao.consultarPorTipoEntidade);
router.get('/', authenticate, controladorItemAvaliacao.consultarTodos);

module.exports = router;
