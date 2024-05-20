const express = require('express');
const router = express.Router();
const departamentoController = require('../controllers/departamentos');

//ROUTES POST
router.post('/add', departamentoController.adicionarDepartamento);

//ROUTES PUT
router.put('/update/:idDepartamento', departamentoController.atualizarDepartamento);

//ROUTES DELETE
router.delete('/delete/:idDepartamento', departamentoController.excluirDepartamento);

//ROUTES GET
router.get('/:idDepartamento', departamentoController.consultarDepartamentoPorID);

module.exports = router;
