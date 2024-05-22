const express = require('express');
const router = express.Router();
const departamentoController = require('../controllers/departamentos');

// POST routes
router.post('/add', departamentoController.adicionar);

// PUT routes
router.put('/update/:idDepartamento', departamentoController.atualizar);

// DELETE routes
router.delete('/delete/:idDepartamento', departamentoController.remover);

// GET routes
router.get('/', departamentoController.consultarTudo);
router.get('/:idDepartamento', departamentoController.consultarPorID);

module.exports = router;
