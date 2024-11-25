import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const adminAuthMiddleware = async (req, res, next) => {
  try {

    const token = req.cookies.adminToken;
  
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: "Not authorized, admin token missing" });
    }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      try{
      // Check if the token has admin role
      if (decoded.role !== "admin") {
        return res.status(403).json({ 
          success: false,
          message: "Access denied. Admins only." });
      }
  
      // Find admin and attach to request
      const admin = await Admin.findById(decoded.id).select("-password");
      if (!admin) {
        return res.status(401).json({ 
          success: false,
          message: "Admin not found" });
      }
  
      req.admin = admin;
      next();
    } catch (jwtError) {
      // Clear cookies on token verification failure
      res.cookie('adminToken', '', { maxAge: 0 });
      res.cookie('adminLoggedIn', '', { maxAge: 0 });

      return res.status(401).json({ 
        success: false,
        message: "Session expired. Please login again." 
      });
    }

  } catch (err) {
      res.status(500).json({ 
        success: false, 
        message: "Server error" });
    }
  };

  export default adminAuthMiddleware;