// Import necessary modules
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// Use CORS middleware
app.use(cors());
app.options('*', cors());

//Use bodyParser middleware
app.use(bodyParser.json());

// Import route files
const eventosRoutes = require('./routes/eventos');

// // Use route files
 app.use('/evento', eventosRoutes);

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log('Server is listening on port '+PORT);
});
