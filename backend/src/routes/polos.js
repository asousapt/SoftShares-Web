const express = require('express');
const router = express.Router();
const poloControlador = require('../controllers/polos');

//ROUTES POST
router.post('/add', poloControlador.adicionarPolo);

//ROUTES PUT
router.put('/update/:idPolo', poloControlador.atualizarPolo);

//ROUTES DELETE
router.delete('/delete/:idPolo', poloControlador.atualizarPolo);

//ROUTES GET
router.get('/', poloControlador.consultarPolo);

module.exports = router;