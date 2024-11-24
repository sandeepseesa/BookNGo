import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Admin from "../models/Admin.js";
import express from "express";
import { truncate } from "fs";
const router = express.Router();

router.post('/', async (req, res) => {
  const { email, password } = req.body;

  // Input validation
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Please enter a valid email address" });
  }

  try {
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
      }
    );

    // Set two cookies:
    // 1. A secure HTTP-only cookie for API authentication
    res.cookie("adminTokenSecure", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: '/',
      maxAge: 3600000,
    });

    // 2. A non-HTTP-only cookie for client-side auth checks
    res.cookie("adminToken", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "lax",
      path: '/',
      maxAge: 3600000,
    });

    // Non-HTTP-only cookie for client-side auth checks
    res.cookie('isAdminAuthenticated', 'true', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 3600000
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