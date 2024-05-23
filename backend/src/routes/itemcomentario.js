const express = require('express');
const router = express.Router();
const itemComentarioController = require('../controllers/itemcomentario');
const { authenticate } = require('../tokenUtils');

// Rotas POST
router.post('/add', authenticate, itemComentarioController.adicionar);

// Rotas PUT
router.put('/update/:idItemComentario', authenticate, itemComentarioController.atualizar);

// Rotas DELETE
router.delete('/delete/:idItemComentario', authenticate, itemComentarioController.remover);

// Rotas GET
router.get('/', authenticate, itemComentarioController.consultarTudo);
router.get('/registro/:idRegistro', authenticate, itemComentarioController.consultarPorRegisto);

module.exports = router;
