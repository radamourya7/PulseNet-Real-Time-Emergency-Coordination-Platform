const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const protect = require("../middleware/authMiddleware");
const { requireSuperAdmin } = require("../middleware/roleMiddleware");

const router = express.Router();

// ── GET /api/admin/admins ─ list all admin accounts (for assign dropdown) ─────
router.get("/admins", protect, requireSuperAdmin, async (req, res) => {
    try {
        const admins = await User.find({ role: "admin", status: "approved" })
            .select("_id name email")
            .sort({ name: 1 });
        res.json(admins);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// ── GET /api/admin/users ─ list all non-superadmin users ──────────────────────
router.get("/users", protect, requireSuperAdmin, async (req, res) => {
    try {
        // Normalize legacy users that were created before the status field existed
        await User.updateMany(
            { role: { $ne: "superadmin" }, status: { $exists: false } },
            { $set: { status: "approved" } }
        );

        const users = await User.find({ role: { $ne: "superadmin" } })
            .select("-password")
            .populate("assignedAdmin", "name email")
            .sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// ── PATCH /api/admin/users/:id/approve ────────────────────────────────────────
router.patch("/users/:id/approve", protect, requireSuperAdmin, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { status: "approved" },
            { new: true }
        ).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// ── PATCH /api/admin/users/:id/reject ─────────────────────────────────────────
router.patch("/users/:id/reject", protect, requireSuperAdmin, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { status: "rejected" },
            { new: true }
        ).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// ── PATCH /api/admin/users/:id/role ─ promote / demote role ───────────────────
router.patch("/users/:id/role", protect, requireSuperAdmin, async (req, res) => {
    try {
        const { role } = req.body;
        if (!["user", "admin"].includes(role))
            return res.status(400).json({ message: "Invalid role. Allowed: user, admin" });

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// ── PATCH /api/admin/users/:id/assign ─ assign user to an admin ───────────────
router.patch("/users/:id/assign", protect, requireSuperAdmin, async (req, res) => {
    try {
        const { adminId } = req.body;  // null to unassign
        const update = { assignedAdmin: adminId || null };
        const user = await User.findByIdAndUpdate(
            req.params.id, update, { new: true }
        ).select("-password").populate("assignedAdmin", "name email");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// ── POST /api/admin/users ─ create an admin account directly ──────────────────
router.post("/users", protect, requireSuperAdmin, async (req, res) => {
    try {
        const { name, email, password, role = "admin" } = req.body;
        if (!name || !email || !password)
            return res.status(400).json({ message: "name, email and password are required" });
        if (!["user", "admin"].includes(role))
            return res.status(400).json({ message: "role must be 'user' or 'admin'" });

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "Email already in use" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name, email,
            password: hashedPassword,
            role,
            status: "approved",   // superadmin-created accounts are immediately approved
        });

        res.status(201).json({
            user: { id: user._id, name: user.name, email: user.email, role: user.role, status: user.status }
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// ── DELETE /api/admin/users/:id ───────────────────────────────────────────────
router.delete("/users/:id", protect, requireSuperAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

module.exports = router;
