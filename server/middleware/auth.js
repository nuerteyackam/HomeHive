const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    console.log('Auth middleware - Headers:', req.headers);
    
    // Get token from Authorization header
    const authHeader = req.header('Authorization');
    console.log('Auth header:', authHeader);
    
    // Check if no auth header
    if (!authHeader) {
        console.log('No Authorization header found');
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // Remove 'Bearer ' from token
        const token = authHeader.split(' ')[1];
        console.log('Extracted token:', token ? `${token.substring(0, 10)}...` : 'no token');
        
        if (!token) {
            console.log('No token found in Authorization header');
            return res.status(401).json({ msg: 'No token, authorization denied' });
        }

        // Verify token
        console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token verified, user:', decoded.user);
        req.user = decoded.user;
        next();
    } catch (err) {
        console.error('Token verification error:', err.message);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
