const express = require('express');
const router = express.Router();
const utilizadorControlador = require('../controllers/utilizadores');
const { authenticate } = require('../tokenUtils');

// ROUTES POST
router.post('/add', authenticate, utilizadorControlador.adicionar);
router.post('/add/mobile', authenticate, utilizadorControlador.adicionarMobile);
router.post('/login', utilizadorControlador.login);

// ROUTES PUT
router.put('/update/:idUtilizador', authenticate, utilizadorControlador.atualizar);
router.put('/update/mobile/:idUtilizador', authenticate, utilizadorControlador.atualizarMobile);
router.put('/alterarPass/:idUtilizador', authenticate, utilizadorControlador.atualizarPass);
router.put('/alterarPass/email/:email', utilizadorControlador.atualizarPassBaseEmail);

// ROUTES DELETE
router.delete('/delete/:idUtilizador', authenticate, utilizadorControlador.remover);

// ROUTES GET
router.get('/ola', utilizadorControlador.ola);
router.get('/', authenticate, utilizadorControlador.consultarTodos);
router.get('/filtro', authenticate, utilizadorControlador.consultarTodosComFiltro);
router.get('/listas', authenticate, utilizadorControlador.listaUsersSimplificado);
router.get('/totalpolo', authenticate, utilizadorControlador.consultarTotalPorPolo);
router.get('/utilizadoresden', authenticate, utilizadorControlador.consultarUsersDen);
router.get('/utilizadorescoment', authenticate, utilizadorControlador.consultarUsersComent);
router.get('/utilizadoresthreads', authenticate, utilizadorControlador.consultarUsersPublicacoes);
router.get('/email/:email', utilizadorControlador.consultarPorEmail);
router.get('/:idUtilizador', authenticate, utilizadorControlador.consultarPorID);
router.get('/mobile/:idUtilizador', authenticate, utilizadorControlador.consultarPorIDMobile);
router.get('/recuperar/:id', authenticate, utilizadorControlador.recuperarPassword);
router.get('/recuperarPass/:email', utilizadorControlador.recuperarPasswordMobile);
router.get('/token/:id', utilizadorControlador.novoToken);

module.exports = router;
