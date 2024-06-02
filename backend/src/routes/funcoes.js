const express = require('express');
const router = express.Router();
const funcoesControlador = require('../controllers/funcoes');
const { authenticate } = require('../tokenUtils');

//ROUTES POST
router.post('/add', authenticate, funcoesControlador.adicionar);

//ROUTES PUT
router.put('/update/:idFuncao', authenticate, funcoesControlador.adicionar);

//ROUTES DELETE
router.delete('/delete/:idFuncao', authenticate, funcoesControlador.remover);

//ROUTES GET
router.get('/', authenticate, funcoesControlador.consultarTudo);
router.get('/filtro', authenticate, funcoesControlador.consultarTudoComFiltroPT);

module.exports = router;