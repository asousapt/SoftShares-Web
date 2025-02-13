const express = require('express');
const router = express.Router();
const pontosInteresseControlador = require('../controllers/pontosInteresse');
const { authenticate } = require('../tokenUtils');

//ROUTES POST
router.post('/add', authenticate, pontosInteresseControlador.adicionar);
router.post('/addMobile', authenticate, pontosInteresseControlador.adicionarMobile);

//ROUTES PUT
router.put('/update/:idPontoInteresse', authenticate, pontosInteresseControlador.atualizar);
router.put('/aprovar/:idPontoInteresse', authenticate, pontosInteresseControlador.aprovar);
router.put('/rejeitar/:idPontoInteresse', authenticate, pontosInteresseControlador.rejeitar);

//ROUTES DELETE
router.delete('/delete/:idPontoInteresse', authenticate, pontosInteresseControlador.remover);

//ROUTES GET
router.get('/', authenticate, pontosInteresseControlador.consultarTudo);
router.get('/aprovados', authenticate, pontosInteresseControlador.consultarTudoAprovado);
router.get('/filtro', authenticate, pontosInteresseControlador.consultarTodosComFiltro);
router.get('/totalpontint', authenticate, pontosInteresseControlador.consultarPontIntTotal);
router.get('/subcategoria/:idSubCat', authenticate, pontosInteresseControlador.consultarPorSubcategoria);
router.get('/porAprovar', authenticate, pontosInteresseControlador.consultarPorAprovar);
router.get('/:idPontoInteresse', authenticate, pontosInteresseControlador.consultarPorID);
router.get('/:idPontoInteresse/mobile', authenticate, pontosInteresseControlador.consultarPontoInteressePorId);

module.exports = router;