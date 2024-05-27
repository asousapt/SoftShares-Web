const express = require('express');
const router = express.Router();
const subcategoriasControlador = require('../controllers/subcategorias');
const { authenticate } = require('../tokenUtils');

//ROUTES POST
router.post('/add', authenticate, subcategoriasControlador.adicionar);
router.post('/addfav', authenticate, subcategoriasControlador.adicionarSubcategoriaFav);

//ROUTES PUT
router.put('/update/:idSubCat', authenticate, subcategoriasControlador.atualizar);
router.put('/fav/update/:idSubCatFav', authenticate, subcategoriasControlador.atualizarSubcategoriaFav);

//ROUTES DELETE
router.delete('/delete/:idSubCat', authenticate, subcategoriasControlador.remover);
router.delete('/fav/delete/:idSubCatFav', authenticate, subcategoriasControlador.removerSubcategoriaFav);

//ROUTES GET
router.get('/', authenticate, subcategoriasControlador.consultarTudo);
router.get('/categoria/:idCat', authenticate, subcategoriasControlador.consultarPorCategoria);

module.exports = router;