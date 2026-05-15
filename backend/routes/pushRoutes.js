const express = require("express");
const User = require("../models/user");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// ── POST /api/push/subscribe — save subscription for admin ───────────────
router.post("/subscribe", protect, async (req, res) => {
    try {
        const { subscription } = req.body;

        if (!subscription) {
            return res.status(400).json({ message: "Subscription is required" });
        }

        // Save subscription only if user is an admin or superadmin
        if (req.user.role === "user") {
            return res.status(403).json({ message: "Only admins can receive push alerts" });
        }

        await User.findByIdAndUpdate(req.user.id, {
            pushSubscription: subscription
        });

        res.status(200).json({ message: "Push subscription activated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to save subscription", error: err.message });
    }
});

router.get("/vapidPublicKey", (req, res) => {
    res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
});

module.exports = router;
