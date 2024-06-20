const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const distritos = require('./controllers/distritos');
const idioma = require('./controllers/idioma');
const categorias = require('./controllers/categorias');
const subcategorias = require('./controllers/subcategorias');
const perfil = require('./controllers/perfis');
const departamento = require('./controllers/departamentos');
const funcoes = require('./controllers/funcoes');
const grupo = require('./controllers/grupo');
const redLandingPage = require('./middlewareCode');
const app = express();

// Use CORS middleware
app.use(cors());
app.options('*', cors());
app.use(redLandingPage);

//Use bodyParser middleware
app.use(bodyParser.json({ limit: '50mb' }));

//Init Data
distritos.init();
idioma.init();
categorias.init();
subcategorias.init();
perfil.init();
departamento.init();
funcoes.init();

// Import route files
const eventosRoutes = require('./routes/eventos');
const polosRoutes = require('./routes/polos');
const categoriasRoutes = require('./routes/categorias');
const subcategoriasRoutes = require('./routes/subcategorias');
const usersRoutes = require('./routes/utilizadores');
const departamentoRoutes = require('./routes/departamentos');
const perfilRoutes = require('./routes/perfis');
const funcoesRoutes = require('./routes/funcoes');
const alertasRoutes = require('./routes/alertas');
const grupoRoutes = require('./routes/grupo');
const pontosInteresseRoutes = require('./routes/pontosInteresse');
const administradorPoloRoutes = require('./routes/administrador_polo');
const utilizadorGrupoRoutes = require('./routes/utilizador_grupo');
const threadRoutes = require('./routes/thread');
const avaliacaoRoutes = require('./routes/avaliacao');
const comentarioRoutes = require('./routes/comentario');
const sessaoRoutes = require('./routes/sessao');
const denunciaRoutes = require('./routes/denuncia');
const formularioRoutes = require('./routes/formularios');
const mensagemRoutes = require('./routes/mensagens');
const notificacoesRoutes = require('./routes/notificacoes');
const cidadesRoutes = require('./routes/cidades');
const idiomaRoutes = require('./routes/idioma');

// Use route files
app.use('/evento', eventosRoutes);
app.use('/polo', polosRoutes);
app.use('/categoria', categoriasRoutes);
app.use('/subcategoria', subcategoriasRoutes);
app.use('/utilizadores', usersRoutes);
app.use('/departamento', departamentoRoutes);
app.use('/perfil', perfilRoutes);
app.use('/funcao', funcoesRoutes);
app.use('/alerta', alertasRoutes);
app.use('/grupo', grupoRoutes);
app.use('/pontoInteresse', pontosInteresseRoutes);
app.use('/administradorpolo', administradorPoloRoutes);
app.use('/utilizadorgrupo', utilizadorGrupoRoutes);
app.use('/thread', threadRoutes);
app.use('/avaliacao', avaliacaoRoutes);
app.use('/comentario', comentarioRoutes);
app.use('/sessao', sessaoRoutes);
app.use('/denuncia', denunciaRoutes);
app.use('/formulario', formularioRoutes);
app.use('/mensagens', mensagemRoutes);
app.use('/notificacao', notificacoesRoutes);
app.use('/cidades', cidadesRoutes);
app.use('/idioma', idiomaRoutes);

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log('Server is listening on port '+PORT);
});
