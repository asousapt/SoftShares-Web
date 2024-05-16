const express = require('express');
const router = express.Router();
const eventoControlador = require('../controllers/eventos');

//ROUTES POST
router.post('/add', eventoControlador.adicionarEvento);

router.post('/utilizador/add', eventoControlador.adicionarParticipante);

//ROUTES PUT
router.put('/update/:idEvento', eventoControlador.atualizarEvento);

router.put('/cancelar/:idEvento', eventoControlador.cancelarEvento);

router.put('/aprovar/:idEvento/:idUser', eventoControlador.aprovarEvento);

router.put('/utilizador/update/:idEvento/:idUser', eventoControlador.atualizarConvidados);

//ROUTES DELETE

router.delete('/utilizador/delete/:idEvento/:idUser', eventoControlador.atualizarConvidados);

//ROUTES GET
router.get('/:idPolo/data/range/:data1/:data2', eventoControlador.consultarEventosEntreDatas);

router.get('/utilizador/lista/:idEvento', eventoControlador.consultarUtilizadoresEvento);

router.get('/utilizador/:idUser', eventoControlador.consultarEventoInscritos);

router.get('/:idPolo/futuro/:numTop', eventoControlador.consultarEventosFuturos);

router.get('/:idEvento', eventoControlador.consultarEventoPorID);

module.exports = router;