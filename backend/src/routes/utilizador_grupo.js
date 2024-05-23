const express = require('express');
const router = express.Router();
const controladorUtilizadorGrupo = require('../controllers/utilizador_grupo');
const { authenticate } = require('../tokenUtils'); // Ajuste o caminho conforme necessário

// POST - Adicionar uma nova associação utilizador-grupo
router.post('/add', authenticate, controladorUtilizadorGrupo.adicionar);

// PUT - Atualizar uma associação utilizador-grupo existente
router.put('/update/:id', authenticate, controladorUtilizadorGrupo.atualizar);

// DELETE - Remover uma associação utilizador-grupo
router.delete('/delete/:id', authenticate, controladorUtilizadorGrupo.remover);

// GET - Consultar associações por grupo
router.get('/grupo/:grupoid', authenticate, controladorUtilizadorGrupo.consultarPorGrupo);

// GET - Consultar associações por utilizador
router.get('/utilizador/:utilizadorid', authenticate, controladorUtilizadorGrupo.consultarPorUtilizador);

module.exports = router;
