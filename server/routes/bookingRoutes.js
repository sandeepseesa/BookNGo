import express from "express";
import Booking from "../models/Booking.js";
import Package from "../models/Package.js";
import User from "../models/User.js";
import authMiddleware from "./authMiddleware.js";
import adminAuthMiddleware from "./adminAuthMiddleware.js";


const router = express.Router();

// Create a booking
router.post('/', authMiddleware, async (req, res) => {
    const { packageId, selectedDate, numberoftravelers } = req.body;

    try {
        // Verify the package exists
        const selectedPackage = await Package.findById(packageId);
        if (!selectedPackage) {
            return res.status(404).json({ message: "Package not found" });
        }

        // Verify number of travelers doesn't exceed maxTravelers
        if (numberoftravelers > selectedPackage.maxTravelers) {
            return res.status(400).json({ message: "Number of travelers exceeds maximum allowed" });
        }

        // Calculate total price
        const totalPrice = selectedPackage.price * numberoftravelers;

        // Create a new booking
        const booking = new Booking({
            userId: req.user.id,
            packageId: packageId,
            email: req.user.email,
            selectedDate: new Date(selectedDate),
            numberoftravelers: numberoftravelers,
            totalPrice: totalPrice,
            status: "Pending"
        });

        const savedBooking = await booking.save();

        // Populate user and package details for response
        const populatedBooking = await Booking.findById(savedBooking._id)
            .populate('userId', 'name email')
            .populate('packageId');

        res.status(201).json({
            message: "Booking successful!",
            booking: populatedBooking
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Failed to create booking", 
            error: error.message 
        });
    }
});

// Get all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'email username')
      .populate('packageId')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single booking by ID
router.get('/:id', authMiddleware || adminAuthMiddleware, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('userId', 'name email').
            populate("packageId");
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

       // Check if user is authorized to view this booking
       if (booking.userId._id.toString() !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized access" });
    }

        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Delete a booking
router.delete('/:id', adminAuthMiddleware, async (req, res) => {
    try {

        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        await Booking.findByIdAndDelete(req.params.id);
        res.status(200).json({ 
            success: true,
            message: "Booking deleted successfully" 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
});

//update booking status
router.patch('/:id/status', adminAuthMiddleware, async (req, res) => {
    try {

        const { status } = req.body;
        
        // Validate status
        if (!['Pending', 'Confirmed', 'Cancelled'].includes(status)) {
            return res.status(400).json({ 
                message: "Invalid status. Must be 'Pending', 'Confirmed', or 'Cancelled'" 
            });
        }

        // Use findByIdAndUpdate instead of find and save
        const updatedBooking = await Booking.findByIdAndUpdate(
            req.params.id,
            {
                $set: { status: status },
                $push: {
                    statusHistory: {
                        status: status,
                        changedBy: req.admin._id,
                        changedAt: new Date()
                    }
                }
            },
            { 
                new: true,      // Return the updated document
                runValidators: true  // Run validators on update
            }
        ).populate('userId packageId');

        if (!updatedBooking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.json({ 
            message: 'Booking status updated successfully',
            booking: updatedBooking
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Internal server error while updating booking status",
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

export default router;