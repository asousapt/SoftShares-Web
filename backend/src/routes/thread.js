const express = require('express');
const router = express.Router();
const controladorThread = require('../controllers/thread');
const { authenticate } = require('../tokenUtils');

// POST - Adicionar uma nova thread
router.post('/add', authenticate, controladorThread.adicionar);

// PUT - Atualizar uma thread existente
router.put('/update/:id', authenticate, controladorThread.atualizar);

// DELETE - Remover uma thread
router.delete('/delete/:id', authenticate, controladorThread.remover);

// GET - Consultar threads por subcategoria
router.get('/subcategoria/:subcategoriaid', authenticate, controladorThread.consultarPorSubcategoria);
router.get('/count/subcategoria', authenticate, controladorThread.consultarPorSubcategoriaCount);

// GET - Consultar threads por utilizador
router.get('/', authenticate, controladorThread.consultarTodos);
router.get('/threadsmes', authenticate, controladorThread.consultarPublicacoesPorMes);
router.get('/threadscat', authenticate, controladorThread.consultarPublicacoesPorCat);
router.get('/totalpubs', authenticate, controladorThread.consultarPubsTotal);
router.get('/mobile/:idPolo', authenticate, controladorThread.consultarTodosMobile);
router.get('/filtro', authenticate, controladorThread.consultarTodosComFiltro);
router.get('/:id', authenticate, controladorThread.consultarPorID);
router.get('/:idTopico/mobile', authenticate, controladorThread.consultarTopicoPorId);

module.exports = router;
