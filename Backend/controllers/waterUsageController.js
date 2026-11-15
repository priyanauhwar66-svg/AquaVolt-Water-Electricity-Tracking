
const WaterUsage = require("../models/waterUsage");

// ADD WATER AND ELECTRICITY USAGE
const addWaterUsage = async (req, res) => {
    try {
        const {
            category,
            quantity,
            electricityQuantity,
            date,
            notes
        } = req.body;

        const water = Number(quantity || 0);
        const electricity = Number(electricityQuantity || 0);

        if (water < 0 || electricity < 0) {
            return res.status(400).json({
                success: false,
                message: "Usage values cannot be negative."
            });
        }

        if (water === 0 && electricity === 0) {
            return res.status(400).json({
                success: false,
                message: "Enter water or electricity usage."
            });
        }

        if (water > 0 && !category) {
            return res.status(400).json({
                success: false,
                message: "Please select a water usage category."
            });
        }

        const usage = await WaterUsage.create({
            user: req.user,
            category: water > 0 ? category : undefined,
            quantity: water,
            electricityQuantity: electricity,
            date: date || Date.now(),
            notes
        });

        res.status(201).json({
            success: true,
            message: "Water and electricity usage added successfully!",
            usage
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// GET ALL USAGE RECORDS
const getWaterUsage = async (req, res) => {
    try {
        const records = await WaterUsage.find({
            user: req.user
        }).sort({ date: -1 });

        res.status(200).json({
            success: true,
            count: records.length,
            records
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// UPDATE USAGE
const updateWaterUsage = async (req, res) => {
    try {
        const {
            category,
            quantity,
            electricityQuantity,
            date,
            notes
        } = req.body;

        const updates = {};

        if (category !== undefined) updates.category = category;
        if (quantity !== undefined) updates.quantity = quantity;
        if (electricityQuantity !== undefined) {
            updates.electricityQuantity = electricityQuantity;
        }
        if (date !== undefined) updates.date = date;
        if (notes !== undefined) updates.notes = notes;

        const record = await WaterUsage.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user
            },
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!record) {
            return res.status(404).json({
                success: false,
                message: "Usage record not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Usage updated successfully!",
            record
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// DELETE USAGE
const deleteWaterUsage = async (req, res) => {
    try {
        const record = await WaterUsage.findOneAndDelete({
            _id: req.params.id,
            user: req.user
        });

        if (!record) {
            return res.status(404).json({
                success: false,
                message: "Usage record not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Usage deleted successfully!"
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    addWaterUsage,
    getWaterUsage,
    updateWaterUsage,
    deleteWaterUsage
};
