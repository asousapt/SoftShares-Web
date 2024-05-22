const express = require('express');
const router = express.Router();
const utilizadorControlador = require('../controllers/utilizadores');

// ROUTES POST
router.post('/add', utilizadorControlador.adicionar);

// ROUTES PUT
router.put('/update/:idUtilizador', utilizadorControlador.atualizar);

// ROUTES DELETE
router.delete('/delete/:idUtilizador', utilizadorControlador.remover);

// ROUTES GET
router.get('/', utilizadorControlador.consultarTodos);
router.get('/:idUtilizador', utilizadorControlador.consultarUtilizador);

module.exports = router;
