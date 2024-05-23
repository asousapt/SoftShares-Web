const express = require('express');
const router = express.Router();
const administradorPoloController = require('../controllers/administrador_polo');
const { authenticate } = require('../tokenUtils'); // Ajuste o caminho conforme necessário

// POST - Adicionar um novo administrador de polo
router.post('/add', authenticate, administradorPoloController.adicionar);

// PUT - Atualizar um administrador de polo existente
router.put('/update/:idAdminPolo', authenticate, administradorPoloController.atualizar);

// DELETE - Remover um administrador de polo
router.delete('/delete/:idAdminPolo', authenticate, administradorPoloController.remover);

// GET - Listar todos os administradores de polo
router.get('/', authenticate, administradorPoloController.listar);

// GET - Consultar um administrador de polo por ID
router.get('/:idAdminPolo', authenticate, administradorPoloController.consultarPorId);

module.exports = router;
