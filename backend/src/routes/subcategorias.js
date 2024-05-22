const express = require('express');
const router = express.Router();
const subcategoriasControlador = require('../controllers/subcategorias');

//ROUTES POST
router.post('/add', subcategoriasControlador.adicionar);
router.post('/addfav', subcategoriasControlador.adicionarSubcategoriaFav);

//ROUTES PUT
router.put('/update/:idSubCat', subcategoriasControlador.adicionar);
router.put('/update/:idSubCatFav', subcategoriasControlador.atualizarSubcategoriaFav);

//ROUTES DELETE
router.delete('/delete/:idSubCat', subcategoriasControlador.remover);
router.delete('/delete/:idSubCatFav', subcategoriasControlador.removerSubcategoriaFav);

//ROUTES GET
router.get('/fav', subcategoriasControlador.consultarTodasSubcategoriasFav);
router.get('/categoria/:idCat', subcategoriasControlador.consultarPorCategoria);
router.get('/fav/:idSubCatFav', subcategoriasControlador.consultarSubcategoriaFavPorID);

module.exports = router;