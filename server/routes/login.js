import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import express from "express";

const router = express.Router();

//login user
router.post('/', async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) { 
            return res.status(404).json({ success: false, message: "User not found" }); }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ success: false, message: "Invalid password" });

        const token = jwt.sign(
            { 
                id: user._id,
                role: "user",
                email: user.email
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: "1h" }
        );

        res.cookie("userToken", token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/',
            maxAge: 1 * 60 * 60 * 1000 // 24 hours
        });

        res.cookie("userLoggedIn", "true", {
            httpOnly: false,
            secure: true,
            sameSite: 'none',
            path: '/',
            maxAge: 1 * 60 * 60 * 1000
          });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                email: user.email,
                role: "user"
            }
        });

    } catch (err) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

export default router;
