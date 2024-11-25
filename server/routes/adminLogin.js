import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Admin from "../models/Admin.js";
import express from "express";

const router = express.Router();

router.post('/', async (req, res) => {

  try {

    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Generate JWT token with admin role explicitly included
    const token = jwt.sign(
      {
        id: admin._id,
        role: "admin",
        email: admin.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // Production secure cookie
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 1 * 60 * 60 * 1000, 
    };

    // set admin token 
    res.cookie("adminToken", token, cookieOptions);

    // Set non-HTTP-only cookie for frontend  
    res.cookie('isAdminAuthenticated', 'true', {
      ...cookieOptions,
      httpOnly: false,
    });

    return res.status(200).json({
      success: true,
      message: "Admin login successful",
      admin: {
        id: admin._id,
        email: admin.email,
        role: "admin"
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false, 
      message: "Server error", 
      error: error.message });
  }
});

export default router;