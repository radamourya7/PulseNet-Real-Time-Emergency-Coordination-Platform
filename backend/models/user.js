const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin", "superadmin"], default: "user" },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    // Which admin this user is assigned to (set by superadmin)
    assignedAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
