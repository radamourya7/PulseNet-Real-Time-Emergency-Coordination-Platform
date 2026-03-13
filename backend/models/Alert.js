const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    type: { type: String, default: "panic" },
    status: { type: String, default: "pending" },
    location: { lat: Number, lng: Number },
    // Copied from user.assignedAdmin at alert-creation time
    assignedAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    evidence: [{
        url: String,
        type: { type: String, enum: ["image", "video", "audio", "document"] },
        createdAt: { type: Date, default: Date.now }
    }],
}, { timestamps: true });

module.exports = mongoose.model("Alert", alertSchema);