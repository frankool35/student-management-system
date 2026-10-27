
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend files
app.use(express.static(path.join(__dirname, "public")));

// Test API route
app.get("/api", (req, res) => {
    res.json({
        message: "Student Management System API is running.",
    });
});

// Student API routes
const studentRoutes = require("./routes/students");
app.use("/api/students", studentRoutes);

// Connect to MongoDB before starting the server
async function startServer() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is missing from the .env file.");
        }

        await mongoose.connect(process.env.MONGODB_URI);

        console.log("MongoDB connected successfully.");

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start the application:", error.message);
        process.exit(1);
    }
}

startServer();
