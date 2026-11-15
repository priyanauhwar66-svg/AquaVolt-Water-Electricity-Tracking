
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const waterUsageRoutes = require("./routes/waterUsageRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Authentication APIs
app.use("/api/auth", authRoutes);

// Water usage APIs
app.use("/api/water-usage", waterUsageRoutes);

// Home route
app.get("/", (req, res) => {
    res.send("Water Tracking App Backend is Running!");
});

// Health check
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Water Tracking Backend is Working!"
    });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();
