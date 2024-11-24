import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const adminAuthMiddleware = async (req, res, next) => {

    //check for secure token first, then check for non-secure token
    const token = req.cookies.adminTokenSecure || req.cookies.adminToken;
  
    if (!token) {
      return res.status(401).json({ message: "Not authorized, admin token missing" });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Check if the token has admin role
      if (decoded.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admins only." });
      }
  
      // Find admin and attach to request
      req.admin = await Admin.findById(decoded.id).select("-password");
      if (!req.admin) {
        return res.status(401).json({ message: "Admin not found" });
      }
  
      next();
    } catch (err) {
      res.status(401).json({ message: "Not authorized, admin token invalid" });
    }
  };

  export default adminAuthMiddleware;