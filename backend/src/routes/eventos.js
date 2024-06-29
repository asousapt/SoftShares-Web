const express = require('express');
const router = express.Router();
const eventoControlador = require('../controllers/eventos');
const { authenticate } = require('../tokenUtils');

//ROUTES POST
router.post('/add', authenticate, eventoControlador.adicionarEvento);

router.post('/utilizador/add', authenticate, eventoControlador.adicionarParticipante);

//ROUTES PUT
router.put('/update/:idEvento', authenticate, eventoControlador.atualizarEvento);

router.put('/cancelar/:idEvento', authenticate, eventoControlador.cancelarEvento);

router.put('/aprovar/:idEvento', authenticate, eventoControlador.aprovarEvento);

router.put('/rejeitar/:idEvento', authenticate, eventoControlador.rejeitarEvento);

router.put('/utilizador/update/:idEvento/:idUser', authenticate, eventoControlador.atualizarConvidados);

//ROUTES DELETE
router.delete('/utilizador/delete/:idEvento/:idUser', authenticate, eventoControlador.removerInscricao);

//ROUTES GET
router.get('/', authenticate, eventoControlador.consultarTodos);

router.get('/filtro', authenticate, eventoControlador.consultarTodosComFiltro);

router.get('/porAprovar', authenticate, eventoControlador.consultarPorAprovar);

router.get('/:idPolo/data/range/:data1/:data2', authenticate, eventoControlador.consultarEventosEntreDatas);

router.get('/utilizador/lista/:idEvento', authenticate, eventoControlador.consultarUtilizadoresEvento);

router.get('/utilizador/:idUser', authenticate, eventoControlador.consultarEventoInscritos);

router.get('/:idPolo/futuro/:numTop', authenticate, eventoControlador.consultarEventosFuturos);

router.get('/:idEvento', authenticate, eventoControlador.consultarEventoPorID);

router.get('/:idEvento/form/:tipoForm', authenticate, eventoControlador.getIdFormularioAResponder);

module.exports = router;