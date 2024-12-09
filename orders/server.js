const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const authenticateToken = require('../authMiddleware');

const app = express();
const PORT = 3002;

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Orders Service',
      version: '1.0.0',
      description: 'Service for managing orders',
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

const orders = [{ id: 1, userId: 1, productId: 2 }];

app.use(express.json());

app.get('/orders', authenticateToken, (req, res) => {
    if(req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    res.json(orders);
});

app.post('/orders/:id', authenticateToken, async (req, res) => { 
    try {
      const response = await fetch(`http://localhost:3003/products/${req.params.id}`, {
        headers: {
          Authorization: `Bearer ${req.headers.authorization.split(' ')[1]}`,
        },
      });
  
      console.log("req : ", req.params.id);
      console.log("response : ", response);
  
      if (response.status === 404) return res.status(404).json({ error: 'Product not found' });
  
      const product = await response.json();
  
      const { id } = req.body;
      const userId = req.user.id;
      const productId = product.id;
      const order = { id: orders.length + 1, userId, productId };
      orders.push(order);
      res.status(201).json(order);
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

app.get('/orders/:userid', authenticateToken, (req, res) => {
    const order = orders.find(o => o.userId === parseInt(req.params.userid));
    console.log("order : ", order);
    console.log("req : ", req.params.userid);
    console.log("req 2 : ", req.user.id);
    if(req.user.role !== 'admin' && req.user.id !== parseInt(req.params.userid)) return res.status(403).json({ error: 'Forbidden' });
    if (!order) return res.status(404).json({ error: 'No order found' });
    res.json(order);
});


app.listen(PORT, () => console.log(`Orders service running on port ${PORT}. Docs: http://localhost:${PORT}/api-docs`));