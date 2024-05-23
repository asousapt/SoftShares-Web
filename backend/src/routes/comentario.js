const express = require('express');
const router = express.Router();
const comentarioController = require('../controllers/comentario');
const { authenticate } = require('../tokenUtils');

// Rotas POST
router.post('/add', authenticate, comentarioController.adicionar);

// Rotas PUT
router.put('/update/:idComentario', authenticate, comentarioController.atualizar);

// Rotas DELETE
router.delete('/delete/:idComentario', authenticate, comentarioController.remover);

// Rotas GET
router.get('/', authenticate, comentarioController.consultarTudo);
router.get('/itemComentario/:idItemComentario', authenticate, comentarioController.consultarComentario);

module.exports = router;
