const express = require('express');
const router = express.Router();
const departamentoController = require('../controllers/departamentos');
const { authenticate } = require('../tokenUtils');

// POST routes
router.post('/add', authenticate, departamentoController.adicionar);

// PUT routes
router.put('/update/:idDepartamento', authenticate, departamentoController.atualizar);

// DELETE routes
router.delete('/delete/:idDepartamento', authenticate, departamentoController.remover);

// GET routes
router.get('/', authenticate, departamentoController.consultarTudo);
router.get('/:idDepartamento', authenticate, departamentoController.consultarPorID);

module.exports = router;
