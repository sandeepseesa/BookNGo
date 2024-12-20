import express from "express";
// import User from "../models/User.js";
import Booking from "../models/Booking.js";
import authMiddleware from "./authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(400).json({ message: 'User not authenticated or missing user ID.' });
  }
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate('userId', 'username email')
      .populate('packageId', 'title destination description price');

    if (!bookings.length) {
      return res.status(404).json({ message: 'No bookings found for this user.' });
    }

    // console.log("user-bookings: ", bookings)

    res.status(200).json({ bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
