const express = require('express');
const router = express.Router();
const comentarioController = require('../controllers/comentario');
const { authenticate } = require('../tokenUtils');

// Rotas POST
router.post('/add', authenticate, comentarioController.adicionar);
router.post('/itemcomentario/add', authenticate, comentarioController.adicionarItemComentario);

// Rotas PUT
router.put('/update/:idComentario', authenticate, comentarioController.atualizar);
router.put('/update/itemcomentario/:idItemComentario', authenticate, comentarioController.atualizarItemComentario);

// Rotas DELETE
router.delete('/delete/:idComentario', authenticate, comentarioController.remover);
router.delete('/delete/itemcomentario/:idItemComentario', authenticate, comentarioController.removerItemComentario);

// Rotas GET
router.get('/', authenticate, comentarioController.consultarTudo);
router.get('/itemcomentario/:idItemComentario', authenticate, comentarioController.consultarPorItemComentario);
router.get('/item/:idComentario', authenticate, comentarioController.consultarComentario);
router.get('/itemcomentario', authenticate, comentarioController.consultarTudoItemComentario);
router.get('/tabela/:tipo/registo/:id', authenticate, comentarioController.consultarComBaseNoItemcomentario);
router.get('/ola', comentarioController.ola);

module.exports = router;
