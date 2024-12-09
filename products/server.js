const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const authenticateToken = require('../authMiddleware');

const app = express();
const PORT = 3003;

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Products Service',
      version: '1.0.0',
      description: 'Service for managing products',
    },
    servers: [{ url: `http://localhost:${PORT}` }],
    components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          }
        }
      },
      security: [{
        bearerAuth: []
      }]
  },
  apis: ['./routes.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const products = [{ id: 1, name: 'Laptop' }, { id: 2, name: 'Phone' }, { id: 3, name: 'Tablet' }, { id: 4, name: 'Smartwatch' }];

app.use(express.json());

app.get('/products', authenticateToken, (req, res) => res.json(products));

app.post('/products', authenticateToken, (req, res) => {
    if(req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    const product = { id: products.length + 1, ...req.body };
    products.push(product);
    res.status(201).json(product);
});

// Get if product exists
app.get('/products/:id', authenticateToken, (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

app.listen(PORT, () => console.log(`Products service running on port ${PORT}. Docs: http://localhost:${PORT}/api-docs`));