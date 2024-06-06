const express = require('express');
const router = express.Router();
const denunciaController = require('../controllers/denuncia');
const { authenticate } = require('../tokenUtils');

// Rotas POST
router.post('/add', authenticate, denunciaController.adicionar);

// Rotas PUT
router.put('/update/:idDenuncia', authenticate, denunciaController.atualizar);

// Rotas DELETE
router.delete('/delete/:idDenuncia', authenticate, denunciaController.remover);

// Rotas GET
router.get('/', authenticate, denunciaController.consultarTudo);
router.get('/filtro', authenticate, denunciaController.consultarTudoComFiltro);
router.get('/comentario/:idComentario', authenticate, denunciaController.consultarComentario);

module.exports = router;
