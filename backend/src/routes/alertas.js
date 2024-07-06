const express = require('express');
const router = express.Router();
const alertaControlador = require('../controllers/alertas');
const { authenticate } = require('../tokenUtils');

//ROUTES POST
router.post('/add', authenticate, alertaControlador.adicionarAlerta);

//ROUTES PUT
router.put('/update/:idAlerta', authenticate, alertaControlador.atualizarAlerta);
router.put('/inativar/:idAlerta', authenticate, alertaControlador.inativarAlerta);

//ROUTES DELETE
router.delete('/delete/:idPolo', authenticate, alertaControlador.removerAlerta);

//ROUTES GET
router.get('/', authenticate, alertaControlador.consultarTudo);
router.get('/filtro', authenticate, alertaControlador.consultarTudoComFiltros);
router.get('/polo/:idPolo/idioma/:idiomaid', authenticate, alertaControlador.consultarAlertasPoloidiomaMobile)
router.get('/polo/:idPolo', authenticate, alertaControlador.consultarAlertaPorPolo);
router.get('/:idAlerta', authenticate, alertaControlador.consultarAlerta);

module.exports = router;