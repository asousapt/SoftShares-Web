const express = require('express');
const router = express.Router();
const alertaControlador = require('../controllers/alertas');

//ROUTES POST
router.post('/add', alertaControlador.adicionarAlerta);

//ROUTES PUT
router.put('/update/:idPolo', alertaControlador.atualizarAlerta);
router.put('/inativar/:idPolo', alertaControlador.inativarAlerta);

//ROUTES DELETE
router.delete('/delete/:idPolo', alertaControlador.removerAlerta);

//ROUTES GET
router.get('/', alertaControlador.consultarAlertas);
router.get('/polo/:idPolo', alertaControlador.consultarAlertaPorPolo);

module.exports = router;