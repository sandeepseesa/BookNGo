import mongoose from "mongoose";

const packageSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        destination: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        availableDates: {
            type: [Date],
            required: true
        },
        maxTravelers: {
            type: Number,
            required: true
        },
    
    }, 
    { timeStamps: true }
);

const Package = mongoose.model('Package', packageSchema);

export default Package;