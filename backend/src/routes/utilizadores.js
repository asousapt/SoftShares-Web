const express = require('express');
const router = express.Router();
const utilizadorControlador = require('../controllers/utilizadores');
const { authenticate } = require('../tokenUtils');

// ROUTES POST
router.post('/add', authenticate, utilizadorControlador.adicionar);

// ROUTES PUT
router.put('/update/:idUtilizador', authenticate, utilizadorControlador.atualizar);

// ROUTES DELETE
router.delete('/delete/:idUtilizador', authenticate, utilizadorControlador.remover);

// ROUTES GET
router.get('/', authenticate, utilizadorControlador.consultarTodos);
router.get('/filtro', authenticate, utilizadorControlador.consultarTodosComFiltro);
router.get('/totalpolo', authenticate, utilizadorControlador.consultarTotalPorPolo);
router.get('/:idUtilizador', authenticate, utilizadorControlador.consultarUtilizador);


module.exports = router;
