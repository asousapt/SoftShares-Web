// Import necessary modules
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const distritos = require('./controllers/distritos');
const idioma = require('./controllers/idioma');
const categorias = require('./controllers/categorias');
const subcategorias = require('./controllers/subcategorias');
const perfil = require('./controllers/perfis');
const app = express();

// Use CORS middleware
app.use(cors());
app.options('*', cors());

//Use bodyParser middleware
app.use(bodyParser.json());

//Init Data
distritos.init();
idioma.init();
categorias.init();
subcategorias.init();
perfil.init();

// Import route files
const eventosRoutes = require('./routes/eventos');
const polosRoutes = require('./routes/polos');
const categoriasRoutes = require('./routes/categorias');
const subcategoriasRoutes = require('./routes/subcategorias');
const usersRoutes = require('./routes/utilizadores');
const departamentoRoutes = require('./routes/departamentos');

// // Use route files
app.use('/evento', eventosRoutes);
app.use('/polo', polosRoutes);
app.use('/categoria', categoriasRoutes);
app.use('/subcategoria', subcategoriasRoutes);
app.use('/utilizadores', usersRoutes);
app.use('/departamento', departamentoRoutes);

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log('Server is listening on port '+PORT);
});
