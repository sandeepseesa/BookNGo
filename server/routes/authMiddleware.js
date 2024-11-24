import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Admin from '../models/Admin.js';

const authMiddleware = async (req, res, next) => {
  
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided."
      });
    }

    try {

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      let user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found"
        });
      }

      req.user = {
        id: user._id,
        name: user.username,
        email: user.email,
        role: 'user'
      };

      next();
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
        error: jwtError.message
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error during authentication",
      error: error.message
    });
  }
};

// Middleware to check if user is admin
export const isAdmin = (req, res, next) => {
  if (!req.isAdmin) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin rights required."
    });
  }
  next();
};

// Middleware to check if user is authenticated
export const isAuthenticated = (req, res, next) => {
  if (!req.user && !req.admin) {
    return res.status(401).json({
      success: false,
      message: "Please login to access this resource"
    });
  }
  next();
};

export default authMiddleware;
