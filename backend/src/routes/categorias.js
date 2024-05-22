const express = require('express');
const router = express.Router();
const categoriasControlador = require('../controllers/categorias');
const { authenticate } = require('../tokenUtils');

//ROUTES POST
router.post('/add', authenticate, categoriasControlador.adicionar);

//ROUTES PUT
router.put('/update/:idCat', authenticate, categoriasControlador.adicionar);

//ROUTES DELETE
router.delete('/delete/:idCat', authenticate, categoriasControlador.remover);

//ROUTES GET
router.get('/', categoriasControlador.consultarTudo);

module.exports = router;