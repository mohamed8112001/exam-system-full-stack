const jwt = require('jsonwebtoken');

const authMiddleware = (roles = []) => {
    return (req, res, next) => {
        const authHeader = req.header('Authorization');
        console.log('Auth Header:', authHeader); // Debug
        const token = authHeader?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
            console.log('Decoded JWT:', decoded); // Debug
            req.user = decoded;
            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(403).json({ message: 'Access denied' });
            }
            next();
        } catch (error) {
            console.log('JWT Error:', error.message); // Debug
            res.status(401).json({ message: 'Invalid token' });
        }
    };
};

module.exports = authMiddleware;