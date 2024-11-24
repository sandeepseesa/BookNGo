import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import express from "express";

const router = express.Router();

//generate token
const generateToken = (user) => {
    return jwt.sign(
      { 
        id: user._id,
        role: "user",
        email: user.email
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: process.env.JWT_EXPIRY }
    );
}

//login user
router.post('/', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if(!user) return res.status(404).json({ message: "User not found" });
        
        const isMatch = await bcrypt.compare(password, user.password);  
        if(!isMatch) return res.status(401).json({ message: "Invalid password" });

        const token = generateToken(user);
        
        // Set cookie with specific settings
        res.cookie("token", token, {
            httpOnly: true, 
            secure: true,
            sameSite: none,
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        res.status(200).json({ 
            message: "Login successful",
            user: {
                id: user._id,
                email: user.email,
                role: "user"
            },
            token: token // Send token in response for debugging
        });

    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
