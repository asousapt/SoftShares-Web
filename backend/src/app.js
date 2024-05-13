// Import necessary modules
const express = require('express');
const cors = require('cors');
const app = express();

// // Import route files
// const indexRouter = require('./routes/index');

// Use CORS middleware
app.use(cors({
    origin: '*' 
}));

// // Use route files
// app.use('/', indexRouter);

// Start the server on port 3000
app.listen(8000, () => {
    console.log('Server is running on port 8000');
});
