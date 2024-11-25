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
            return res.status(400).json({ 
                success: false, 
                message: "Email and password are required" 
            });
        }

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ 
                success: false, 
                message: "Admin not found" 
            });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid credentials" 
            });
        }

        // Generate token
        const token = jwt.sign(
            {
                id: admin._id,
                role: "admin",
                email: admin.email
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Set token in HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: true, // for HTTPS
            sameSite: 'none', // for cross-origin
            maxAge: 60 * 60 * 1000 // 1 hour
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
        console.error('Login error:', error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
});

export default router;