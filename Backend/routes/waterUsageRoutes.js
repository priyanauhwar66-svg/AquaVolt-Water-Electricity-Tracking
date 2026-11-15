
const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    addWaterUsage,
    getWaterUsage,
    updateWaterUsage,
    deleteWaterUsage
} = require("../controllers/waterUsageController");

// Add a water usage record
router.post("/", protect, addWaterUsage);

// Get all water usage records
router.get("/", protect, getWaterUsage);

// Update a water usage record
router.put("/:id", protect, updateWaterUsage);

// Delete a water usage record
router.delete("/:id", protect, deleteWaterUsage);

module.exports = router;
