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
      return res.status(404).json({ message: "Admin not found" });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
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
        algorithm: 'HS256'
      }
    );

    // Production secure cookie
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 3600000,
    };

    // set secure HTTP-only cookie
    res.cookie("adminTokenSecure", token, cookieOptions);

    // Set non-HTTP-only cookie with limited data
    res.cookie('adminAuth', 'true', {
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
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;