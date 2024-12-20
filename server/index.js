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
import authMiddleware from './routes/authMiddleware.js';
import userBookings from './routes/userBookings.js';


const app = express();
dotenv.config();


app.use(cors({
    origin: 'https://bookngo-client.onrender.com',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [ 'Content-Type','Authorization'],
    exposedHeaders: ['Authorization']
}));

app.use(express.json());

app.use(cookieParser());

// headers for cookie handling
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

app.use('/user/register', registerRoutes);
app.use('/user/login', userLogin);
app.use('/booking', bookingRoutes);
app.use('/package', packageRoutes);
app.use('/admin/login', adminLogin);
app.use('/admin/register', adminRegister);
app.use('/user/bookings', userBookings);

app.get('/auth/check', authMiddleware, (req, res) => {
    return res.json({
        success: true,
        user: {
            id: req.user.id,
            email: req.user.email,
            role: req.user.role
        }
    });
});

// Logout User
app.get('/logout', async (req, res) => {
    res.cookie('userToken', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
        maxAge: 0
    });

    return res.status(200).json({ success: true, message: "Logged out successfully" });
});

// Add this route for admin logout
app.get('/admin/logout', async (req, res) => {
    res.cookie("adminToken", '', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
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
