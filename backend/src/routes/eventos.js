const express = require('express');
const router = express.Router();
const eventoControlador = require('../controllers/eventos');

//ROUTES POST
router.post('/add', eventoControlador.adicionarEvento);

//ROUTES PUT
router.put('/update/:idEvento', eventoControlador.atualizarEvento);

router.put('/cancelar/:idEvento', eventoControlador.cancelarEvento);

router.put('/aprovar/:idEvento/:idUser', eventoControlador.aprovarEvento);

//ROUTES GET
router.get('/:idEvento', eventoControlador.consultarEventoPorID);

router.get('/:poloID/data/range/:data1/:data2', eventoControlador.consultarEventosEntreDatas);

module.exports = router;