// Import necessary modules
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const distritos = require('./controllers/distritos');
const app = express();

// Use CORS middleware
app.use(cors());
app.options('*', cors());

//Use bodyParser middleware
app.use(bodyParser.json());

//Init Data
distritos.init();

// Import route files
const eventosRoutes = require('./routes/eventos');
const polosRoutes = require('./routes/polos');

// // Use route files
app.use('/evento', eventosRoutes);
app.use('/polo', polosRoutes);

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log('Server is listening on port '+PORT);
});
