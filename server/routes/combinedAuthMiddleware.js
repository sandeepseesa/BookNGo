import authMiddleware from "./authMiddleware.js";
import adminAuthMiddleware from "./adminAuthMiddleware.js";
import jwt from 'jsonwebtoken';


const combinedAuthMiddleware = async (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: 'Access denied. Token missing or malformed',
            });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check the role and route to the appropriate middleware
        if (decoded.role === 'admin') {
            await adminAuthMiddleware(req, res, next);
        } else {
            await authMiddleware(req, res, next);
        }
    } catch (authError) {
        return res.status(403).json({
            message: "Access denied: Authorization required.",
        });
    }
};

export default combinedAuthMiddleware;