const express = require('express');
const router = express.Router();
const funcoesControlador = require('../controllers/funcoes');

//ROUTES POST
router.post('/add', funcoesControlador.adicionar);

//ROUTES PUT
router.put('/update/:idFuncao', funcoesControlador.adicionar);

//ROUTES DELETE
router.delete('/delete/:idFuncao', funcoesControlador.remover);

//ROUTES GET
router.get('/', funcoesControlador.consultarTudo);

module.exports = router;