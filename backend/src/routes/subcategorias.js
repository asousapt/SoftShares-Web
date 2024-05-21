const express = require('express');
const router = express.Router();
const subcategoriasControlador = require('../controllers/subcategorias');

//ROUTES POST
router.post('/add', subcategoriasControlador.adicionar);

//ROUTES PUT
router.put('/update/:idSubCat', subcategoriasControlador.adicionar);

//ROUTES DELETE
router.delete('/delete/:idSubCat', subcategoriasControlador.remover);

//ROUTES GET
router.get('/categoria/:idCat', subcategoriasControlador.consultarPorCategoria);

module.exports = router;