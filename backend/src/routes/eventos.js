const express = require('express');
const router = express.Router();
const eventoControlador = require('../controllers/eventos');
const { authenticate } = require('../tokenUtils');

//ROUTES POST
router.post('/add', authenticate, eventoControlador.adicionarEvento);

router.post('/utilizador/add', authenticate, eventoControlador.adicionarParticipante);

router.post('/inscricao', authenticate, eventoControlador.inscricaoEvento);

router.post('/formQualidade', authenticate, eventoControlador.respostaQualidadeFinal);

//ROUTES PUT
router.put('/update/:idEvento', authenticate, eventoControlador.atualizarEvento);

router.put('/update/mobile/:idEvento', authenticate, eventoControlador.atualizarEventoMobile);

router.put('/cancelar/:idEvento', authenticate, eventoControlador.cancelarEvento);

router.put('/aprovar/:idEvento', authenticate, eventoControlador.aprovarEvento);

router.put('/rejeitar/:idEvento', authenticate, eventoControlador.rejeitarEvento);

router.put('/utilizador/update/:idEvento/:idUser', authenticate, eventoControlador.atualizarConvidados);

//ROUTES DELETE
router.delete('/utilizador/delete/:idEvento/:idUser', authenticate, eventoControlador.removerInscricao);

//ROUTES GET
router.get('/', authenticate, eventoControlador.consultarTodos);

router.get('/filtro', authenticate, eventoControlador.consultarTodosComFiltro);

router.get('/incricto/:idUtilizador', authenticate, eventoControlador.consultarEventosInscritos);

router.get('/participantes/:idEvento', authenticate, eventoControlador.getparticipantes);

router.get('/porAprovar', authenticate, eventoControlador.consultarPorAprovar);

router.get('/totaleventos', authenticate, eventoControlador.consultarEventosTotal);

router.get('/:idevento/mobile', authenticate, eventoControlador.consultarEventoPorIdMob);

router.get('/:idPolo/data/range/:data1/:data2/utilizador/:idUtilizador', authenticate, eventoControlador.consultarEventosEntreDatas);

router.get('/:idPolo/data/range/:data1/:data2/utilizador/:idUtilizador/categoria/:categoriaId', authenticate, eventoControlador.consultarEventosEntreDataeCat);

router.get('/:idPolo/data/range/:data1/:data2/utilizador/:idUtilizador/filtro/:filtro', authenticate, eventoControlador.consultarEventosEntreDataeFiltro);

router.get('/utilizador/lista/:idEvento', authenticate, eventoControlador.consultarUtilizadoresEvento);

router.get('/utilizador/:idUser', authenticate, eventoControlador.consultarEventoInscritos);

router.get('/:idPolo/futuro/:numTop', authenticate, eventoControlador.consultarEventosFuturos);

router.get('/:idEvento', authenticate, eventoControlador.consultarEventoPorID);

router.get('/mobile/:idEvento', authenticate, eventoControlador.buscaEventoPorIdEditar);

router.get('/:idEvento/form/:tipoForm', authenticate, eventoControlador.getIdFormularioAResponder);

router.get('/form/:idFormulario', authenticate, eventoControlador.getPerguntasFormulario);

module.exports = router;