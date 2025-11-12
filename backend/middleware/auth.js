const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    try {
        // Get token from request header
        const authHeader = req.headers.authorization;
        console.log('Auth header received:', authHeader);

        // Check if token exists
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({message: 'Access denied. No token provided.'});
        }

        // Extract token (remove 'Bearer ' prefix)
        const token = authHeader.split(' ')[1];
        console.log('Extracted token:', token);
        console.log('Token length:', token?.length);

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token decoded successfully:', decoded);

        // Attach user ID to request object for use in route handlers
        req.userId = decoded.userId;

        // Continue to the next middleware or route handler
        next();
    } catch (e) {
        console.error('Auth middleware error:', e);

        // Handle specific JWT errors
        if (e.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token.' });
        } 

        if (e.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired.' });
        }

        // Generic server error
        res.status(500).json({ message: 'Server error during authentication. Please try again later.' });
    }
};

module.exports = authMiddleware;