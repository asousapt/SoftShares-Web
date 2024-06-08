const express = require('express');
const router = express.Router();
const categoriasControlador = require('../controllers/categorias');
const { authenticate } = require('../tokenUtils');

//ROUTES POST
router.post('/add', authenticate, categoriasControlador.adicionar);

//ROUTES PUT
router.put('/update/:idCat', authenticate, categoriasControlador.atualizar);

//ROUTES DELETE
router.delete('/delete/:idCat', authenticate, categoriasControlador.remover);

//ROUTES GET
router.get('/', authenticate, categoriasControlador.consultarTudo);
router.get('/filtro', authenticate, categoriasControlador.consultarTudoComFiltroPT);
router.get('/:idCat', categoriasControlador.consultarPorID);

module.exports = router;