import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Access denied. No token provided.' 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            res.clearCookie('token');
            return res.status(401).json({
                success: false,
                message: 'Token expired. Please login again.'
            });
        }
        return res.status(400).json({ 
            success: false, 
            message: 'Invalid token.' 
        });
    }
};

export default authMiddleware;
