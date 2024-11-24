import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        // phone: {
        //     type: String,
        //     required: true
        // },
        password: {
            type: String,
            required: true
        },
        bookings: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Booking',
            },
        ],
    }, 
    { timestamps: true }
);

const User = mongoose.model('User', UserSchema);

export default User;