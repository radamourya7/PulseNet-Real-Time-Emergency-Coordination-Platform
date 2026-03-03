const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    type: { type: String, default: "panic" },
    status: { type: String, default: "pending" },
    location: {
        lat: Number,
        lng: Number
    }
}, { timestamps: true });

module.exports = mongoose.model("Alert", alertSchema);