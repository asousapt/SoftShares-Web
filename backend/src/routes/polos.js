const express = require('express');
const router = express.Router();
const poloControlador = require('../controllers/polos');
const { authenticate } = require('../tokenUtils');

//ROUTES POST
router.post('/add', authenticate, poloControlador.adicionarPolo);

//ROUTES PUT
router.put('/update/:idPolo', authenticate, poloControlador.atualizarPolo);

//ROUTES DELETE
router.delete('/delete/:idPolo', authenticate, poloControlador.apagarPolo);

//ROUTES GET
router.get('/', authenticate, poloControlador.consultarTodos);
router.get('/mobile ', authenticate, poloControlador.consultarTodosMobile);
router.get('/filtro', authenticate, poloControlador.consultarTodosComFiltro);
router.get('/:idPolo', authenticate, poloControlador.consultarPoloPorID);

module.exports = router;