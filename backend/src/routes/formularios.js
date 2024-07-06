const express = require('express');
const router = express.Router();
const controladorFormularios = require('../controllers/formularios');
const { authenticate } = require('../tokenUtils');

//ROUTES POST
router.post('/add', authenticate, controladorFormularios.adicionar);
router.post('/:formularioid/versao/add', authenticate, controladorFormularios.adicionarVersao);
router.post('/respostas', authenticate, controladorFormularios.adicionarResposta);

//ROUTES GET
router.get('/genericos', authenticate, controladorFormularios.consultarTodosGenericoVersaoMaisRecente);
router.get('/generico/filtro', authenticate, controladorFormularios.consultarGenericosComFiltro);
router.get('/idformm/:idFormulario', authenticate, controladorFormularios.getPerguntasFormulario);
router.get('/subcatm/:idSubcat', authenticate, controladorFormularios.getIdFormularioAResponder);
router.get('/subcat/:idSubcat', authenticate, controladorFormularios.consultarPorSubcatVersaoMaisRecente);
router.get('/versao/:formularioVersaoid/:idRegisto/:tabela/respostas/consultar/:userid', authenticate, controladorFormularios.consultarRespostasPorFormulario);
router.get('/:id/:tabela', authenticate, controladorFormularios.consultarPerguntas);
router.get('/:idForm', authenticate, controladorFormularios.consultarGenericoPorIDVersaoMaisRecente);
router.get('/:idFormulario/tabela/:tabela/utilizador/:idUtilizador/registo/:idRegisto', authenticate, controladorFormularios.obtemRespostasFormulariosMobile);
router.get('/:idFormulario/tabela/:tabela/registo/:idRegisto', authenticate, controladorFormularios.obtemRespostasTodosMobile);



module.exports = router;
