const jwt = require('jsonwebtoken');
const SECRET = 'supersecretkey'; // Clé utilisée pour signer les tokens dans le service Auth

function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1]; // Récupérer le token dans l'en-tête
    if (!token) return res.status(401).json({ error: 'Access denied' });

    jwt.verify(token, SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        console.log('user : ', user);
        console.log('req user : ', req.user);
        req.user = user; // Attache l'utilisateur décodé à la requête
        next();
    });
}

module.exports = authenticateToken;