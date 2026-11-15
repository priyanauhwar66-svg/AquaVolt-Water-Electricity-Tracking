
const mongoose = require("mongoose");

const waterUsageSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        // Water consumption category (optional for the combined form)
        category: {
            type: String,
            enum: [
                "Drinking",
                "Cooking",
                "Bathing",
                "Cleaning",
                "Laundry",
                "Gardening",
                "Other"
            ]
        },

        // Existing water quantity field (litres)
        quantity: {
            type: Number,
            min: 0
        },

        // Electricity consumption (kWh)
        electricityQuantity: {
            type: Number,
            default: 0,
            min: 0
        },

        date: {
            type: Date,
            default: Date.now
        },

        notes: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("WaterUsage", waterUsageSchema);
