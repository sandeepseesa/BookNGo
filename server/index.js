import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bookingRoutes from './routes/bookingRoutes.js';
import packageRoutes from './routes/packageRoutes.js';
import userLogin from './routes/login.js';
import registerRoutes from './routes/register.js';
import cookieParser from 'cookie-parser';
import adminLogin from './routes/adminLogin.js';
import adminRegister from './routes/adminRegister.js';


const app = express();
dotenv.config();

app.use(express.json());

app.use(cookieParser());

app.use(cors({
    origin: 'https://bookngo-client.onrender.com',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    exposedHeaders: ['set-cookie']
}));


app.use('/user/register', registerRoutes);
app.use('/user/login', userLogin);
app.use('/booking', bookingRoutes);
app.use('/package', packageRoutes);
app.use('/admin/login', adminLogin);
app.use('/admin/register', adminRegister);


// Logout User
app.get('/logout', async (req, res) => {
    res.cookie('userToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',
        maxAge: 0
    });

    res.cookie('userLoggedIn', '', {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',
        maxAge: 0
    });

    return res.status(200).json({ success: true, message: "Logged out successfully" });
});

// Add this route for admin logout
app.get('/admin/logout', async (req, res) => {
    res.cookie("adminToken", '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',
        maxAge: 0
    });

    res.cookie('adminLoggedIn', '', {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',
        maxAge: 0
    });

    return res.status(200).json({ success: true, message: "Logged out successfully" });
});

const PORT = process.env.PORT || 5000; 

//connect database and server
mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        app.listen(PORT);
    })
    .catch((err) => {
        console.log(err);
    })
