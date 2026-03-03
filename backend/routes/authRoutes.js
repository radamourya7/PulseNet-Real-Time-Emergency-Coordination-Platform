const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();

// ── Register (always 'user' role, always starts as 'pending') ─────────────────
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password)
            return res.status(400).json({ message: "name, email and password are required" });

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "Email already in use" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name, email,
            password: hashedPassword,
            role: "user",
            status: "pending",   // superadmin must approve before login
        });

        const token = jwt.sign(
            { id: user._id, role: user.role, status: user.status },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(201).json({
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role, status: user.status }
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// ── Login ─────────────────────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "No account found with that email." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Incorrect password." });

        // Block pending accounts
        if (user.status === "pending")
            return res.status(403).json({
                message: "Your account is awaiting superadmin approval. You will be able to login once approved.",
                status: "pending"
            });

        // Block rejected accounts
        if (user.status === "rejected")
            return res.status(403).json({
                message: "Your account access has been rejected. Contact the administrator.",
                status: "rejected"
            });

        const token = jwt.sign(
            { id: user._id, role: user.role, status: user.status },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role, status: user.status }
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

module.exports = router;