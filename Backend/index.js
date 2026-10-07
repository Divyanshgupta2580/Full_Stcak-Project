const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const cors = require('cors');
const products = require('./data.js'); // Importing the products data
const app = express();
app.use(cors());
app.use(bodyparser.json());
const PORT = 3000;


app.get('/', (req, res) => {
    res.send('Welcome to the API');
});
app.get('/api/data', (req, res) => {
    res.json(products);
});
app.listen(PORT, () => {
  console.log(` Server listening on port ${PORT}`);
});