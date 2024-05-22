const express = require('express');
const router = express.Router();
const subcategoriasControlador = require('../controllers/subcategorias');
const { authenticate } = require('../tokenUtils');

//ROUTES POST
router.post('/add', authenticate, subcategoriasControlador.adicionar);

//ROUTES PUT
router.put('/update/:idSubCat', authenticate, subcategoriasControlador.adicionar);

//ROUTES DELETE
router.delete('/delete/:idSubCat', authenticate, subcategoriasControlador.remover);

//ROUTES GET
router.get('/categoria/:idCat', authenticate, subcategoriasControlador.consultarPorCategoria);

module.exports = router;