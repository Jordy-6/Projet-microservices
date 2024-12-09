const express = require('express');
const axios = require('axios');
const authenticateToken = require('../authMiddleware');

const app = express();
const PORT = 3000; // Port de l'API Gateway

app.use(express.json());

// Routage vers le service Auth
app.post('/login', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:3004/login', req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Internal server error' });
  }
});

// Routage vers le service Users
app.get('/users', authenticateToken, async (req, res) => {
  try {
    const response = await axios.get('http://localhost:3001/users', {
      headers: { Authorization: req.headers.authorization },
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Internal server error' });
  }
});

// Routage vers le service Orders
app.get('/orders', authenticateToken, async (req, res) => {
  try {
    const response = await axios.get('http://localhost:3002/orders', {
      headers: { Authorization: req.headers.authorization },
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Internal server error' });
  }
});

app.post('/orders/:id', authenticateToken, async (req, res) => {
  try {
    const response = await axios.post(`http://localhost:3002/orders/${req.params.id}`, req.body, {
      headers: { Authorization: req.headers.authorization },
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Internal server error' });
  }
});

app.get('/orders/:userid', authenticateToken, async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:3002/orders/${req.params.userid}`, {
      headers: { Authorization: req.headers.authorization },
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Internal server error' });
  }
});

// Routage vers le service Products
app.get('/products', authenticateToken, async (req, res) => {
  try {
    const response = await axios.get('http://localhost:3003/products', {
      headers: { Authorization: req.headers.authorization },
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Internal server error' });
  }
});

app.post('/products', authenticateToken, async (req, res) => {
  try {
    const response = await axios.post('http://localhost:3003/products', req.body, {
      headers: { Authorization: req.headers.authorization },
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Internal server error' });
  }
});

// Lancement de l'API Gateway
app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));