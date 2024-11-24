import express from "express";
import bcrypt from "bcrypt";
import Admin from "../models/Admin.js";

const router = express.Router();

router.post('/', async (req, res) => {

  const { name, email, password, secretKey } = req.body;

  // Normalize email
  const normalizedEmail = email.toLowerCase().trim();

  // Secret key for admin registration (should be stored securely in .env)
  const ADMIN_SECRET = process.env.ADMIN_SECRET;

  // Input validation
  if (!name || !normalizedEmail || !password || !secretKey) {
    const missingFields = [];
    if (!name) missingFields.push('name');
    if (!normalizedEmail) missingFields.push('email');
    if (!password) missingFields.push('password');
    if (!secretKey) missingFields.push('secretKey');
    return res.status(400).json({
      message: "Missing required fields",
      missingFields
    });
  }
  // Username validation
  if (name.length < 3 || name.length > 30) {
    return res.status(400).json({ message: "Username must be between 3 and 30 characters" });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(normalizedEmail)) {
    return res.status(400).json({ message: "Please enter a valid email address" });
  }

  // Password validation
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long" });
  }

  // Password validation with specific feedback
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  if (!passwordRegex.test(password)) {
    const issues = [];
    if (!/(?=.*[a-z])/.test(password)) issues.push('lowercase letter');
    if (!/(?=.*[A-Z])/.test(password)) issues.push('uppercase letter');
    if (!/(?=.*\d)/.test(password)) issues.push('number');
    if (!/(?=.*[@$!%*?&])/.test(password)) issues.push('special character');
    if (password.length < 6) issues.push('minimum length of 6 characters');

    return res.status(400).json({
      message: "Password requirements not met",
      missing: issues
    });
  }

  try {
    // Verify the secret key
    if (secretKey !== ADMIN_SECRET) {
      return res.status(403).json({ message: "Unauthorized access. Secret key is incorrect" });
    }

    // Check if admin with the same email already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new admin
    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
    });

    await newAdmin.save();
    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
