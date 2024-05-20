const express = require('express');
const router = express.Router();
const categoriasControlador = require('../controllers/categorias');

//ROUTES POST
router.post('/add', categoriasControlador.adicionar);

//ROUTES PUT
router.put('/update/:idCat', categoriasControlador.adicionar);

//ROUTES DELETE
router.delete('/delete/:idCat', categoriasControlador.remover);

//ROUTES GET
router.get('/', categoriasControlador.consultarTudo);

module.exports = router;