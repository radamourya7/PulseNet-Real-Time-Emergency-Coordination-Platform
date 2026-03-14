const express = require("express");
const Alert = require("../models/Alert");
const User = require("../models/user");
const protect = require("../middleware/authMiddleware");
const { requireAdmin } = require("../middleware/roleMiddleware");

const router = express.Router();

// ── POST /api/alerts — any approved user can send a panic alert ───────────────
router.post("/", protect, async (req, res) => {
    console.log(`📥 POST /api/alerts - Req size: ${JSON.stringify(req.body).length} bytes`);
    try {
        const { lat, lng, type, evidence } = req.body;

        // Look up the user's assigned admin
        const userDoc = await User.findById(req.user.id).select("assignedAdmin");
        const assignedAdmin = userDoc?.assignedAdmin || null;

        const alert = await Alert.create({
            user: req.user.id,
            type: type || "panic",
            location: { lat: lat || 0, lng: lng || 0 },
            assignedAdmin,
            evidence: evidence || [],
        });

        await alert.populate("user", "name email role");

        const io = req.app.get("io");
        if (io) {
            if (assignedAdmin) {
                io.to(`admin:${assignedAdmin}`).emit("new-alert", alert);
                io.to("superadmin-room").emit("new-alert", alert);
            } else {
                io.emit("new-alert", alert);
            }
        }

        res.status(201).json(alert);
    } catch (err) {
        res.status(500).json({ message: "Failed to create alert", error: err.message });
    }
});

// ── GET /api/alerts/mine — user's own alerts (no admin required) ─────────────
router.get("/mine", protect, async (req, res) => {
    try {
        const alerts = await Alert.find({ user: req.user.id })
            .sort({ createdAt: -1 });
        res.json(alerts);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch alerts", error: err.message });
    }
});

// ── GET /api/alerts ───────────────────────────────────────────────────────────
router.get("/", protect, requireAdmin, async (req, res) => {
    try {
        let query = {};

        if (req.user.role === "admin") {
            // Admin sees: alerts assigned to them OR alerts not assigned to anyone
            query = {
                $or: [
                    { assignedAdmin: req.user.id },
                    { assignedAdmin: null },
                    { assignedAdmin: { $exists: false } },
                ]
            };
        }
        // superadmin: no filter — sees everything

        const alerts = await Alert.find(query)
            .populate("user", "name email role")
            .populate("assignedAdmin", "name email")
            .sort({ createdAt: -1 });

        res.json(alerts);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch alerts", error: err.message });
    }
});

// ── PATCH /api/alerts/:id — update alert status (admin only) ──────────────────
router.patch("/:id", protect, requireAdmin, async (req, res) => {
    try {
        const { status } = req.body;

        // Verify admin owns this alert (unless superadmin)
        const alertDoc = await Alert.findById(req.params.id);
        if (!alertDoc) return res.status(404).json({ message: "Alert not found" });

        if (req.user.role === "admin" &&
            alertDoc.assignedAdmin?.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not your assigned alert" });
        }

        const updated = await Alert.findByIdAndUpdate(
            req.params.id, { status }, { new: true }
        ).populate("user", "name email role")
            .populate("assignedAdmin", "name email");

        const io = req.app.get("io");
        if (io) {
            // Notify admin sidebar
            if (updated.assignedAdmin) {
                io.to(`admin:${updated.assignedAdmin._id || updated.assignedAdmin}`).emit("alert-updated", updated);
            } else {
                io.emit("alert-updated", updated);
            }
            // Also always notify superadmin
            io.to("superadmin-room").emit("alert-updated", updated);
            // Notify the user who sent the alert
            if (status === "resolved" && updated.user) {
                io.to(`user:${updated.user._id || updated.user}`).emit("alert-resolved", updated);
            }
        }

        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: "Failed to update alert", error: err.message });
    }
});

// ── PATCH /api/alerts/:id/assign — assign alert to an admin ────────────────
router.patch("/:id/assign", protect, requireAdmin, async (req, res) => {
    try {
        const { adminId } = req.body; // null to unassign
        const alertDoc = await Alert.findById(req.params.id);
        if (!alertDoc) return res.status(404).json({ message: "Alert not found" });

        // Only superadmins or the current assigned admin can reassign
        if (req.user.role === "admin" &&
            alertDoc.assignedAdmin &&
            alertDoc.assignedAdmin.toString() !== req.user.id) {
            return res.status(403).json({ message: "Access denied: Not your alert to reassign" });
        }

        const updated = await Alert.findByIdAndUpdate(
            req.params.id,
            { assignedAdmin: adminId || null },
            { new: true }
        ).populate("user", "name email role")
            .populate("assignedAdmin", "name email");

        const io = req.app.get("io");
        if (io) {
            if (adminId) io.to(`admin:${adminId}`).emit("alert-updated", updated);
            io.to("superadmin-room").emit("alert-updated", updated);
            io.emit("alert-updated", updated);
        }
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: "Failed to assign responder", error: err.message });
    }
});

// ── DELETE /api/alerts/:id — admin only ───────────────────────────────────────
router.delete("/:id", protect, requireAdmin, async (req, res) => {
    try {
        const alertDoc = await Alert.findById(req.params.id);
        if (!alertDoc) return res.status(404).json({ message: "Alert not found" });

        if (req.user.role === "admin" &&
            alertDoc.assignedAdmin?.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not your assigned alert" });
        }

        await Alert.findByIdAndDelete(req.params.id);

        const io = req.app.get("io");
        if (io) {
            const payload = { id: req.params.id };
            if (alertDoc.assignedAdmin) {
                io.to(`admin:${alertDoc.assignedAdmin}`).emit("alert-deleted", payload);
            } else {
                io.emit("alert-deleted", payload);
            }
        }

        res.json({ message: "Alert deleted" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete alert", error: err.message });
    }
});

module.exports = router;