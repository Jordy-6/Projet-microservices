const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const authenticateToken = require('../authMiddleware');

const app = express();
const PORT = 3001;

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Users Service',
      version: '1.0.0',
      description: 'Service for managing users',
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

const users = [{ id: 1, name: 'Alice', password: 'password1' }, { id: 2, name: 'Bob', password: 'password2' }];

app.use(express.json());
app.get('/users', authenticateToken, (req, res) => res.json(users));

app.delete('/users/:id', authenticateToken, (req, res) => {
  if(req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'User not found' });

  users.splice(users.indexOf(user), 1);
  res.status(204).send();
});

app.get('/users/username/:username', (req, res) => {
  const user = users.find(u => u.name === req.params.username);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

app.listen(PORT, () => console.log(`Users service running on port ${PORT}. Docs: http://localhost:${PORT}/api-docs`));