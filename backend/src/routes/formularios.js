const express = require('express');
const router = express.Router();
const controladorFormularios = require('../controllers/formularios');
const { authenticate } = require('../tokenUtils');

//ROUTES POST
router.post('/', authenticate, controladorFormularios.adicionar);

router.post('/:formularioid/versoes', authenticate, controladorFormularios.adicionarVersao);

router.post('/respostas', authenticate, controladorFormularios.adicionarResposta);

//ROUTES GET
router.get('/:id/:tabela', authenticate, controladorFormularios.consultarFormulario);
router.get('/versao/:formularioVersaoid/:idRegisto/:tabela/respostas/consultar/:userid', authenticate, controladorFormularios.consultarRespostasPorFormulario);

module.exports = router;
