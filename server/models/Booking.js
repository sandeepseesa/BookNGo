import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    packageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Package',
        required: true
    },
    email: {
        type: String,
        required: true
    },
    selectedDate: {
        type: Date,
        required: true
    },
    numberoftravelers: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled'],
        default: 'Pending'
    },
    statusHistory: [{
        status: {
            type: String,
            enum: ['Pending', 'Confirmed', 'Cancelled'],

        },
        changedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin'
        },
        changedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;