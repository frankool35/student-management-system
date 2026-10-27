
const express = require("express");
const mongoose = require("mongoose");
const Student = require("../models/Student");

const router = express.Router();

// GET: Retrieve all students
router.get("/", async (req, res) => {
    try {
        const students = await Student.find().sort({ createdAt: -1 });
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve students." });
    }
});

// GET: Retrieve one student by ID
router.get("/:id", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid student ID." });
        }

        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({ message: "Student not found." });
        }

        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve student." });
    }
});

// POST: Add a new student
router.post("/", async (req, res) => {
    try {
        const { firstName, lastName, email, age, course } = req.body;

        if (
            !firstName?.trim() ||
            !lastName?.trim() ||
            !email?.trim() ||
            age === undefined ||
            age === null ||
            age === "" ||
            !course?.trim()
        ) {
            return res.status(400).json({
                message: "All fields are required.",
            });
        }

        const student = await Student.create({
            firstName,
            lastName,
            email,
            age,
            course,
        });

        res.status(201).json({
            message: "Student added successfully.",
            student,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "A student with this email already exists.",
            });
        }

        if (error.name === "ValidationError" || error.name === "CastError") {
            return res.status(400).json({ message: error.message });
        }

        res.status(500).json({ message: "Failed to add student." });
    }
});

// PUT: Update an existing student
router.put("/:id", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid student ID." });
        }

        const { firstName, lastName, email, age, course } = req.body;

        if (
            !firstName?.trim() ||
            !lastName?.trim() ||
            !email?.trim() ||
            age === undefined ||
            age === null ||
            age === "" ||
            !course?.trim()
        ) {
            return res.status(400).json({
                message: "All fields are required.",
            });
        }

        const student = await Student.findByIdAndUpdate(
            req.params.id,
            { firstName, lastName, email, age, course },
            { new: true, runValidators: true }
        );

        if (!student) {
            return res.status(404).json({ message: "Student not found." });
        }

        res.status(200).json({
            message: "Student updated successfully.",
            student,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "A student with this email already exists.",
            });
        }

        if (error.name === "ValidationError" || error.name === "CastError") {
            return res.status(400).json({ message: error.message });
        }

        res.status(500).json({ message: "Failed to update student." });
    }
});

// DELETE: Remove a student
router.delete("/:id", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid student ID." });
        }

        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({ message: "Student not found." });
        }

        res.status(200).json({
            message: "Student deleted successfully.",
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete student." });
    }
});

module.exports = router;
