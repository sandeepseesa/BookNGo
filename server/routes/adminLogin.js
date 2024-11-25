import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import adminAuthMiddleware from "./adminAuthMiddleware.js";

const router = express.Router();

// Admin login route
router.post('/', async (req, res) => {
    try {
        const { email, password } = req.body;

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

        const token = jwt.sign(
            {
                id: admin._id,
                email: admin.email,
                role: 'admin'
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Set token in header
        res.setHeader('Authorization', `Bearer ${token}`);

        return res.status(200).json({
            success: true,
            message: "Admin login successful",
            admin: {
                id: admin._id,
                email: admin.email,
                role: 'admin'
            }
        });

    } catch (error) {
        console.error('Admin login error:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// Verify admin route
router.get('/verify', adminAuthMiddleware, (req, res) => {
    return res.json({
        success: true,
        admin: {
            id: req.admin._id,
            email: req.admin.email,
            role: 'admin'
        }
    });
});

// Add admin logout route
router.post('/logout', (req, res) => {
    try {
        res.setHeader('Authorization', '');
        res.clearCookie('token');
        return res.status(200).json({
            success: true,
            message: 'Admin logged out successfully'
        });
    } catch (error) {
        console.error('Admin logout error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error logging out admin'
        });
    }
});

export default router;