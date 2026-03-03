const express = require("express");
const Alert = require("../models/Alert");
const protect = require("../middleware/authMiddleware");
const { requireAdmin } = require("../middleware/roleMiddleware");

const router = express.Router();

// POST /api/alerts — any authenticated user can create an alert (panic button)
router.post("/", protect, async (req, res) => {
    try {
        const { lat, lng, type } = req.body;
        const alert = await Alert.create({
            user: req.user.id,
            type: type || "panic",
            location: { lat: lat || 0, lng: lng || 0 },
        });

        // Populate user info so the admin gets name/email in real time
        await alert.populate("user", "name email role");

        // Emit real-time event to all connected admin clients
        const io = req.app.get("io");
        if (io) io.emit("new-alert", alert);

        res.status(201).json(alert);
    } catch (err) {
        res.status(500).json({ message: "Failed to create alert", error: err.message });
    }
});

// GET /api/alerts — admin only
router.get("/", protect, requireAdmin, async (req, res) => {
    try {
        const alerts = await Alert.find()
            .populate("user", "name email role")
            .sort({ createdAt: -1 });
        res.json(alerts);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch alerts", error: err.message });
    }
});

// PATCH /api/alerts/:id — update alert status (admin only)
router.patch("/:id", protect, requireAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        const alert = await Alert.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate("user", "name email role");

        if (!alert) return res.status(404).json({ message: "Alert not found" });

        // Broadcast status change to all clients
        const io = req.app.get("io");
        if (io) io.emit("alert-updated", alert);

        res.json(alert);
    } catch (err) {
        res.status(500).json({ message: "Failed to update alert", error: err.message });
    }
});

// DELETE /api/alerts/:id — admin only
router.delete("/:id", protect, requireAdmin, async (req, res) => {
    try {
        await Alert.findByIdAndDelete(req.params.id);
        const io = req.app.get("io");
        if (io) io.emit("alert-deleted", { id: req.params.id });
        res.json({ message: "Alert deleted" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete alert", error: err.message });
    }
});

module.exports = router;