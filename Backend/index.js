const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const cors = require('cors');
const products = require('./data.js'); // Importing the products data
const app = express();
app.use(cors());
app.use(bodyparser.json());
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the API', endpoints: ['/api/data', '/api/products', '/health'] });
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/data', (req, res) => {
    res.json(products);
});

app.get('/api/products', (req, res) => {
    res.json(products);
});

app.get('/api/products/:id', (req, res) => {
    const productId = parseInt(req.params.id, 10);
    const product = products.find(p => p.id === productId);
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
});

app.listen(PORT, () => {
  console.log(` Server listening on port ${PORT}`);
});