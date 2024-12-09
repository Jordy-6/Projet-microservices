const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const app = express();
const PORT = 3004;
const SECRET = 'supersecretkey';

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Auth Service',
      version: '1.0.0',
      description: 'Service for user authentication and JWT generation',
    },
    servers: [{ url: `http://localhost:${PORT}` }],
  },
  apis: ['./routes.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(express.json());

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Vérifie l'utilisateur via le service Users
    const userResponse = await axios.get(`http://localhost:3001/users/username/${username}`);
    const user = userResponse.data;
    console.log(user);

    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Génère le token JWT
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.listen(PORT, () => console.log(`Auth service running on port ${PORT}. Docs: http://localhost:${PORT}/api-docs`));