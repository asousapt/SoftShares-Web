const express = require('express');
const router = express.Router();
const grupoControlador = require('../controllers/grupo');
const { authenticate } = require('../tokenUtils');

//ROUTES POST
router.post('/add', authenticate, grupoControlador.adicionar);

//ROUTES PUT
router.put('/update/:id', authenticate, grupoControlador.atualizar);

//ROUTES DELETE
router.delete('/delete/:id', authenticate, grupoControlador.remover);

//ROUTES GET
router.get('/publicos/:utilizadorid', authenticate, grupoControlador.listarTodosOsGruposPublicos);
router.get('/subcategoria/:subcategoriaid', authenticate, grupoControlador.consultarPorSubcategoria);
router.get('/utilizador/:utilizadorid', authenticate, grupoControlador.consultarPorUtilizador);

module.exports = router;
